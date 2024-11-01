from django.db import models  

# Create your models here.

class Facture(models.Model):
    """
    Modèle pour une facture contenant les informations du client et le montant total.
    """
    
    numero = models.CharField(max_length=50, unique=True)  # Champ pour le numéro de facture, doit être unique
    nom_client = models.CharField(max_length=255)  # Champ pour le nom du client
    email_client = models.EmailField()  # Champ pour l'email du client, avec validation d'email
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)  # Champ pour le montant total de la facture

    def __str__(self):
        """Retourne une représentation sous forme de chaîne de la facture."""
        return f"Facture {self.numero} - {self.nom_client}"

class ArticleDeFacture(models.Model):
    """
    Modèle pour les articles liés à une facture.
    """
    
    facture = models.ForeignKey(Facture, related_name='articles', on_delete=models.CASCADE)  # Lien vers la facture, avec suppression en cascade
    description = models.CharField(max_length=255)  # Champ pour la description de l'article
    quantite = models.PositiveIntegerField()  # Champ pour la quantité d'articles, ne peut pas être négatif
    prix = models.DecimalField(max_digits=10, decimal_places=2)  # Champ pour le prix unitaire de l'article
    prix_total = models.DecimalField(max_digits=10, decimal_places=2)  # Champ pour le prix total de l'article (quantité x prix)

    def __str__(self):
        """Retourne une représentation sous forme de chaîne de l'article de facture."""
        return f"{self.description} - {self.quantite} x {self.prix}"
