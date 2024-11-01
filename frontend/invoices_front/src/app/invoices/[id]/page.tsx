"use client"; 

import React, { useState, useEffect } from 'react'; 
import { useParams } from 'next/navigation'; 
import axios from 'axios'; 
import { InvoiceDetails } from '@/app/types/type'; 
import { FaFileDownload } from 'react-icons/fa'; 

const InvoiceDetail: React.FC = () => {
  const { id } = useParams(); // Récupération de l'identifiant de la facture à partir de l'URL.
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null); // État pour stocker les détails de la facture, initialisé à null.

  useEffect(() => {
    // Hook pour charger les détails de la facture lorsque le composant est monté.
    const fetchInvoice = async () => {
      try {
        // Requête pour récupérer les détails de la facture par ID.
        const response = await axios.get(`http://localhost:8000/api/invoices/${id}/`);
        setInvoice(response.data); // Mise à jour de l'état avec les données de la facture.
      } catch (error) {
        console.error('Erreur lors du chargement de la facture:', error); // Gestion des erreurs de requête.
      }
    };

    if (id) fetchInvoice(); // Appel de la fonction de récupération si l'ID est disponible.
  }, [id]); // Dépendance à l'ID pour re-exécuter l'effet si l'ID change.

  const downloadPDF = async () => {
    // Fonction pour télécharger la facture au format PDF.
    try {
      const response = await axios.get(`http://localhost:8000/api/invoices/pdf/${invoice?.numero}/`, {
        responseType: 'blob', // Indique que la réponse doit être traitée comme un blob.
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data])); // Création d'une URL blob à partir des données reçues.
      const link = document.createElement('a'); // Création d'un élément <a> pour le téléchargement.
      link.href = url; // Définition de l'URL pour le lien.
      link.setAttribute('download', `facture_${invoice?.numero}.pdf`); // Attribution d'un nom de fichier pour le téléchargement.
      document.body.appendChild(link); // Ajout temporaire du lien au document pour le clic.
      link.click(); // Simulation d'un clic pour lancer le téléchargement.
      link.remove(); // Suppression du lien du document après le téléchargement.
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error); // Gestion des erreurs lors du téléchargement.
    }
  };

  // Affichage d'un indicateur de chargement tant que la facture n'est pas encore chargée.
  if (!invoice) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Rendu principal une fois la facture chargée.
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Facture {invoice.numero}</h1>
      
      <div className="border p-4 rounded-lg shadow-lg bg-white">
        {/* Bouton de téléchargement PDF */}
        <button
            onClick={downloadPDF} // Événement de clic pour déclencher le téléchargement.
            className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          >
          <FaFileDownload className="mr-2" /> {/* Icône de téléchargement */}
          Télécharger en PDF
        </button>
        <br/>
        <p className="text-lg font-semibold mb-2">Nom du Client: {invoice.nom_client}</p> {/* Affichage du nom du client */}
        <p className="text-lg font-semibold mb-2">Montant Total: {invoice.montant_total} €</p> {/* Affichage du montant total */}

        <h2 className="text-xl font-bold mt-4 mb-2">Articles :</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Description</th> {/* En-tête de colonne pour la description */}
                <th className="border border-gray-300 p-2">Quantité</th> {/* En-tête de colonne pour la quantité */}
                <th className="border border-gray-300 p-2">Prix unitaire</th> {/* En-tête de colonne pour le prix unitaire */}
                <th className="border border-gray-300 p-2">Prix total</th> {/* En-tête de colonne pour le prix total */}
              </tr>
            </thead>
            <tbody>
              {invoice.articles.map((article, index) => ( // Itération sur les articles de la facture pour les afficher
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{article.description}</td> {/* Description de l'article */}
                  <td className="border border-gray-300 p-2">{article.quantite}</td> {/* Quantité de l'article */}
                  <td className="border border-gray-300 p-2">{article.prix} €</td> {/* Prix unitaire de l'article */}
                  <td className="border border-gray-300 p-2">{article.prix_total} €</td> {/* Prix total de l'article */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetail; 
