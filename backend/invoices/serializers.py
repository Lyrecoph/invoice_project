from rest_framework import serializers
from .models import Facture, ArticleDeFacture


class ArticleDeFactureSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les articles de facture.
    """
    class Meta:
        model = ArticleDeFacture
        fields = ['description', 'quantite', 'prix', 'prix_total']


class FactureSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les factures (résumé).
    """
    class Meta:
        model = Facture
        fields = ['id', 'numero', 'nom_client', 'montant_total']


class FactureDetailSerializer(serializers.ModelSerializer):
    """
    Sérialiseur détaillé pour une facture et ses articles.
    """
    articles = ArticleDeFactureSerializer(many=True, read_only=True)

    class Meta:
        model = Facture
        fields = ['id', 'numero', 'nom_client', 'email_client', 'montant_total', 'articles']
