import pytest
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework import status

@pytest.mark.django_db
def test_upload_file_view(api_client):
    # Simule l'upload d'un fichier CSV valide contenant les informations de facture
    file = SimpleUploadedFile("test.csv", 
        "Numéro de facture,Nom du client,Email du client,Description de l'article,Quantité d'article,Prix de l'article\nINV123,John Doe,john@example.com,Product A,1,100".encode("utf-8")
    )
    
    # Effectue une requête POST à l'endpoint pour uploader le fichier
    response = api_client.post(reverse("upload-file"), {"file": file})
    
    # Vérifie que la réponse a un statut 201 (créé)
    assert response.status_code == status.HTTP_201_CREATED
    # Vérifie que le message de succès est présent dans la réponse
    assert "Factures traitées avec succès." in response.data["message"]

@pytest.mark.django_db
def test_facture_list_view(api_client, facture):
    # Teste l'endpoint qui retourne la liste des factures
    response = api_client.get(reverse("facture-list"))
    
    # Vérifie que la réponse a un statut 200 (OK)
    assert response.status_code == status.HTTP_200_OK
    # Vérifie que la liste contient une facture
    assert len(response.data) == 1
    # Vérifie que la facture retournée a le bon numéro
    assert response.data[0]["numero"] == facture.numero

@pytest.mark.django_db
def test_facture_detail_view(api_client, facture, article_de_facture):
    # Teste l'endpoint qui retourne les détails d'une facture
    response = api_client.get(reverse("facture-detail", args=[facture.id]))
    
    # Vérifie que la réponse a un statut 200 (OK)
    assert response.status_code == status.HTTP_200_OK
    # Vérifie que le numéro de la facture dans la réponse est correct
    assert response.data["numero"] == facture.numero
    # Vérifie que la facture contient un article
    assert len(response.data["articles"]) == 1

@pytest.mark.django_db
def test_facture_pdf_view(api_client, facture):
    # Teste l'endpoint qui génère le PDF d'une facture
    response = api_client.get(reverse("facture-pdf", args=[facture.numero]))
    
    # Vérifie que la réponse a un statut 200 (OK)
    assert response.status_code == status.HTTP_200_OK
    # Vérifie que le type de contenu est un PDF
    assert response["Content-Type"] == "application/pdf"
