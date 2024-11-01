"use client"; 

import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { useFormik } from 'formik'; 
import * as Yup from 'yup'; 

const Upload: React.FC = () => {
  // Déclaration d'un état pour gérer les messages de succès ou d'erreur.
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Configuration de Formik pour gérer le formulaire.
  const formik = useFormik({
    initialValues: {
      file: null as File | null, // Valeur initiale du champ fichier, initialement null.
    },
    // Validation du formulaire avec Yup.
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required('Veuillez sélectionner un fichier CSV ou Excel') // Champ fichier requis.
        .test('fileFormat', 'Seuls les fichiers CSV ou Excel sont acceptés', (value) => {
          // Vérification du format du fichier.
          return (
            value instanceof File && // Vérifie que la valeur est un fichier.
            (value.type === 'text/csv' || // Vérifie le type de fichier.
              value.type === 'application/vnd.ms-excel' ||
              value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          );
        }),
    }),
    // Fonction appelée lors de la soumission du formulaire.
    onSubmit: async (values) => {
      const formData = new FormData(); // Création d'un nouvel objet FormData pour les données du formulaire.
      if (values.file) {
        formData.append('file', values.file); // Ajout du fichier à FormData si un fichier est sélectionné.
      }

      try {
        // Envoi de la requête POST pour télécharger le fichier.
        await axios.post('http://localhost:8000/api/invoices/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, // Spécification du type de contenu.
        });
        // Si le téléchargement réussit, mettre à jour le message de succès.
        setMessage({ text: 'Fichier téléchargé avec succès!', type: 'success' });
      } catch (error) {
        // Si une erreur se produit, mettre à jour le message d'erreur.
        setMessage({ text: 'Erreur lors du téléchargement du fichier.', type: 'error' });
        console.error(error); // Affiche l'erreur dans la console pour le débogage.
      }
    },
  });

  // Utilisation de useEffect pour supprimer le message après un certain temps.
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 20000); // Supprime le message après 20 secondes.
      return () => clearTimeout(timer); // Nettoyage du timer lors de la destruction du composant.
    }
  }, [message]); // Dépendance sur le message pour déclencher l'effet.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Upload CSV/Excel</h1>

      <div className="bg-blue-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2" htmlFor="file">
              Sélectionner un fichier
            </label>
            <input
              type="file" // Champ de type fichier.
              name="file"
              accept=".csv, .xls, .xlsx" // Accepte uniquement les fichiers CSV et Excel.
              onChange={(event) => {
                formik.setFieldValue('file', event.currentTarget.files?.[0]); // Met à jour la valeur du fichier dans Formik.
              }}
              className="block w-full p-2 border border-gray-300 rounded"
            />
            {/* Affichage d'un message d'erreur si le champ est touché et qu'il y a une erreur. */}
            {formik.errors.file && formik.touched.file && (
              <p className="text-red-500 mt-1">{formik.errors.file}</p>
            )}
          </div>

          <button
            type="submit" // Bouton pour soumettre le formulaire.
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            Télécharger
          </button>
        </form>

        {/* Affichage d'un message de succès ou d'erreur après la soumission du formulaire. */}
        {message && (
          <p
            className={`mt-4 p-2 text-center rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Upload; 