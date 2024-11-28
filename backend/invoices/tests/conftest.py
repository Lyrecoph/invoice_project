import pytest
from rest_framework.test import APIClient
from invoices.models import Facture, ArticleDeFacture

""" Le fichier conftest.py pour configurer des fixtures globales. 
Cela simplifiera la configuration d'objets réutilisables pour vos tests :"""

@pytest.fixture
def api_client():
    # Fixture pour créer un client API pour les tests
    return APIClient()

@pytest.fixture
def facture():
    # Fixture pour créer une facture à utiliser dans les tests
    return Facture.objects.create(numero="INV123", nom_client="John Doe", email_client="johndoe@example.com", montant_total=0)

@pytest.fixture
def article_de_facture(facture):
    # Fixture pour créer un article de facture lié à une facture existante
    return ArticleDeFacture.objects.create(facture=facture, description="Article A", quantite=1, prix=100, prix_total=100)
