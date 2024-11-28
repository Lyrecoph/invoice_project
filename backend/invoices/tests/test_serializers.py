import pytest
from invoices.serializers import FactureSerializer, FactureDetailSerializer, ArticleDeFactureSerializer


@pytest.mark.django_db
def test_facture_serializer(facture):
    # Teste le sérialiseur pour la création de factures
    serializer = FactureSerializer(facture)
    data = serializer.data
    
    # Vérifie que les données sérialisées sont correctes
    assert data['numero'] == "INV123"
    assert data['nom_client'] == "John Doe"

@pytest.mark.django_db
def test_facture_detail_serializer(facture, article_de_facture):
    # Teste le sérialiseur pour les détails d'une facture
    serializer = FactureDetailSerializer(facture)
    data = serializer.data
    
    # Vérifie que le numéro de la facture et le nombre d'articles sont corrects
    assert data['numero'] == "INV123"
    assert len(data['articles']) == 1
    # Vérifie que la description de l'article est correcte
    assert data['articles'][0]['description'] == "Article A"

@pytest.mark.django_db
def test_article_de_facture_serializer(article_de_facture):
    # Teste le sérialiseur pour les articles de facture
    serializer = ArticleDeFactureSerializer(article_de_facture)
    data = serializer.data
    
    # Vérifie que les données sérialisées de l'article sont correctes
    assert data['description'] == "Article A"
    assert data['quantite'] == 1
