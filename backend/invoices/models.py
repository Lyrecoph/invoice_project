from django.db import models

# Create your models here.


from django.db import models

class Facture(models.Model):
    numero = models.CharField(max_length=50, unique=True)
    nom_client = models.CharField(max_length=255)
    email_client = models.EmailField()
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Facture {self.numero} - {self.nom_client}"

class ArticleDeFacture(models.Model):
    facture = models.ForeignKey(Facture, related_name='articles', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    quantite = models.PositiveIntegerField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    prix_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.description} - {self.quantite} x {self.prix}"
