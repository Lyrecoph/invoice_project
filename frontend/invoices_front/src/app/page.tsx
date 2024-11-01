"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Bienvenue sur votre application générateur de factures à partir de CSV/Excel</h1>
      
      {/* Section principale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        {/* Carte pour l'Upload */}
        <Link href="/upload">
          <div className="bg-blue-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h2 className="text-xl font-semibold">Upload de Fichiers</h2>
            <p className="mt-2 text-gray-600">Téléchargez facilement des fichiers CSV ou Excel pour ajouter des données de facturation.</p>
          </div>
        </Link>

        {/* Carte pour les Factures */}
        <Link href="/invoices">
          <div className="bg-green-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h2 className="text-xl font-semibold">Consulter les Factures</h2>
            <p className="mt-2 text-gray-600">Accédez à la liste des factures pour consulter les informations détaillées.</p>
          </div>
        </Link>
      </div>

      {/* Autres sections pour une meilleure UX */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Nouvelles Fonctionnalités</h2>
        <p className="text-gray-600">Autres fonctionnalités sont à ajoutées pour améliorer votre expérience.</p>
      </div>
    </div>
  );
}
