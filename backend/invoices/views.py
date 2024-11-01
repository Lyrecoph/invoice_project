from decimal import Decimal
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

import pandas as pd
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer

from .models import Facture, ArticleDeFacture
from .serializers import FactureSerializer, FactureDetailSerializer


class FacturePDFView(APIView):
    """
    Vue pour générer un PDF d'une facture spécifique en fonction de son numéro.
    """
    def get(self, request, numero, *args, **kwargs):
        # Récupération de la facture ou renvoie une erreur 404 si non trouvée
        facture = get_object_or_404(Facture, numero=numero)

        # Initialisation de la réponse HTTP en PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="facture_{facture.numero}.pdf"'

        # Création du document PDF
        pdf = SimpleDocTemplate(response, pagesize=letter)
        elements = []

        # Titre
        styles = getSampleStyleSheet()
        title = Paragraph(f"Facture #{facture.numero}", styles['Title'])
        elements.append(title)

        # Informations de la facture
        data = [
            ['Client:', facture.nom_client],
            ['Email:', facture.email_client],
            ['Montant Total:', f"{facture.montant_total:.2f} €"],
        ]

        # Table des informations de la facture
        info_table = Table(data)
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(info_table)

        # Détails des articles
        article_data = [['Description', 'Quantité', 'Prix Unitaire', 'Prix Total']]
        for article in facture.articles.all():
            article_data.append([
                article.description,
                article.quantite,
                f"{article.prix:.2f} €",
                f"{article.prix_total:.2f} €"
            ])

        # Table des articles de facture
        article_table = Table(article_data)
        article_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (0, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(article_table)

        # Finalisation du document PDF
        pdf.build(elements)

        return response


class UploadFileView(APIView):
    """
    Vue pour le téléchargement de fichiers (CSV ou Excel) et création de factures et d'articles.
    """
    def post(self, request, *args, **kwargs):
        # Récupération du fichier téléchargé
        file = request.FILES.get('file')
        
        # Validation de la présence de fichier
        if not file:
            return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

        # Validation du type de fichier
        if not file.name.endswith(('.csv', '.xlsx')):
            return Response({"error": "Format de fichier non supporté. Veuillez télécharger un fichier CSV ou Excel."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Chargement du fichier en fonction de son format
            df = pd.read_csv(file) if file.name.endswith('.csv') else pd.read_excel(file)

            # Vérification des colonnes nécessaires dans le fichier
            required_columns = ['Numéro de facture', 'Nom du client', 'Email du client', 'Description de l\'article', 'Quantité d\'article', 'Prix de l\'article']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return Response({"error": f"Colonnes manquantes : {', '.join(missing_columns)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Processus de traitement pour chaque ligne du fichier
            factures_crees = []
            for _, row in df.iterrows():
                try:
                    # Création ou récupération de la facture
                    facture, created = Facture.objects.get_or_create(
                        numero=row['Numéro de facture'],
                        defaults={
                            'nom_client': row['Nom du client'],
                            'email_client': row['Email du client'],
                            'montant_total': 0
                        }
                    )

                    # Calcul du prix total de l'article
                    prix_total_article = Decimal(row['Quantité d\'article']) * Decimal(row['Prix de l\'article'])
                    ArticleDeFacture.objects.create(
                        facture=facture,
                        description=row['Description de l\'article'],
                        quantite=row['Quantité d\'article'],
                        prix=row['Prix de l\'article'],
                        prix_total=prix_total_article
                    )

                    # Mise à jour du montant total de la facture
                    facture.montant_total += prix_total_article
                    facture.save()
                    factures_crees.append(facture.numero)

                except ValidationError as e:
                    continue  # Continue en cas d'erreur de validation pour cette ligne

            return Response({"message": "Factures traitées avec succès.", "factures": factures_crees}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Erreur de traitement : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FactureListView(ListAPIView):
    """
    Vue pour obtenir la liste de toutes les factures.
    """
    queryset = Facture.objects.all()  # Obtient toutes les factures de la base de données
    serializer_class = FactureSerializer  # Spécifie le sérialiseur à utiliser pour les réponses


class FactureDetailView(RetrieveAPIView):
    """
    Vue pour obtenir les détails d’une facture spécifique.
    """
    queryset = Facture.objects.all()  # Obtient toutes les factures de la base de données
    serializer_class = FactureDetailSerializer  # Spécifie le sérialiseur à utiliser pour les réponses détaillées
