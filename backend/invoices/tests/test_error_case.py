import pytest
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework import status

"""Ajoutez des tests pour gérer les cas d'erreur, par exemple lorsque les colonnes attendues
dans le fichier d'upload sont manquantes ou lorsque le format du fichier est incorrect."""

@pytest.mark.django_db
def test_upload_file_missing_columns(api_client):
    # Simule l'upload d'un fichier CSV manquant certaines colonnes requises
    file = SimpleUploadedFile("test.csv", "Numéro de facture,Nom du client\n".encode("utf-8"))
    response = api_client.post(reverse("upload-file"), {"file": file})
    
    # Vérifie que la réponse a un statut 400 (Bad Request)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    # Vérifie que le message d'erreur contient "Colonnes manquantes"
    assert "Colonnes manquantes" in response.data["error"]

@pytest.mark.django_db
def test_upload_file_unsupported_format(api_client):
    # Simule l'upload d'un fichier avec un format non supporté
    file = SimpleUploadedFile("test.txt", b"Test file content")
    response = api_client.post(reverse("upload-file"), {"file": file})
    
    # Vérifie que la réponse a un statut 400 (Bad Request)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    # Vérifie que le message d'erreur contient "Format de fichier non supporté"
    assert "Format de fichier non supporté" in response.data["error"]
