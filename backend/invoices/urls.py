from django.urls import path  # Importation de la fonction path pour définir les routes d'URL
from .views import UploadFileView, FactureListView, FactureDetailView, FacturePDFView  # Importation des vues à associer aux URL

urlpatterns = [
    # Route pour le téléchargement de fichiers de factures
    path('invoices/upload/', UploadFileView.as_view(), name='upload-file'),
    
    # Route pour afficher la liste des factures
    path('invoices/', FactureListView.as_view(), name='facture-list'),
    
    # Route pour afficher les détails d'une facture spécifique, identifiée par son ID (pk)
    path('invoices/<int:pk>/', FactureDetailView.as_view(), name='facture-detail'),
    
    # Route pour générer un PDF d'une facture, identifiée par son numéro
    path('invoices/pdf/<str:numero>/', FacturePDFView.as_view(), name='facture-pdf'), 
]
