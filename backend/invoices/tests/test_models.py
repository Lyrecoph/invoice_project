import pytest
from invoices.models import Facture, ArticleDeFacture

@pytest.mark.django_db
def test_facture_creation():
    # Teste la création d'une facture
    facture = Facture.objects.create(numero="INV123", nom_client="John Doe", email_client="johndoe@example.com", montant_total=100)
    
    # Vérifie que le numéro de la facture est correct
    assert facture.numero == "INV123"
    # Vérifie que la représentation de la facture est correcte
    assert str(facture) == "Facture INV123 - John Doe"

@pytest.mark.django_db
def test_article_de_facture_creation(facture):
    # Teste la création d'un article de facture lié à une facture existante
    article = ArticleDeFacture.objects.create(facture=facture, description="Product X", quantite=2, prix=50, prix_total=100)
    
    # Vérifie que les données de l'article sont correctes
    assert article.description == "Product X"
    assert article.quantite == 2
    assert article.prix_total == 100
    # Vérifie que la représentation de l'article est correcte
    assert str(article) == "Product X - 2 x {:.2f}".format(article.prix)
