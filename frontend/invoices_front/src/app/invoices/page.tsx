"use client"; 

import React, { useEffect, useState } from 'react'; 
import { useTable, usePagination, useGlobalFilter, useSortBy, Column } from 'react-table'; 
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; 
import axios from 'axios'; 
import Link from 'next/link'; 
import { Invoice } from '@/app/types/type'; 
import 'tailwindcss/tailwind.css'; 

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]); // État pour stocker la liste des factures
  const [loading, setLoading] = useState<boolean>(true); // État pour indiquer si les données sont en cours de chargement
  const [isClient, setIsClient] = useState(false); // État pour vérifier si le composant est exécuté côté client
  // const [pageSize, setPageSize] = useState(10); // État pour le nombre de lignes par page

  // useEffect pour charger les factures lors du montage du composant
  useEffect(() => {
    setIsClient(true); // Confirme que l'exécution est côté client
    
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices/`); // Requête pour récupérer les factures
        setInvoices(response.data); // Stockage des données de factures dans l'état
      } catch (error) {
        console.error('Erreur lors du chargement des factures:', error); // Gestion des erreurs
      } finally {
        setLoading(false); // Indique que le chargement est terminé
      }
    };
    fetchInvoices(); // Appel de la fonction pour récupérer les factures
  }, []); // Dépendance vide pour exécuter l'effet une seule fois

  // Mémoisation des données et des colonnes pour react-table
  const data = React.useMemo(() => invoices, [invoices]); // Utilisation de useMemo pour optimiser les performances
  const columns: Column<Invoice>[] = React.useMemo(
    () => [
      {
        Header: 'Numéro de Facture',
        accessor: 'numero', // Accesseur pour le numéro de la facture
      },
      {
        Header: 'Nom du Client',
        accessor: 'nom_client', // Accesseur pour le nom du client
      },
      {
        Header: 'Montant Total (€)',
        accessor: 'montant_total', // Accesseur pour le montant total
        Cell: ({ value }: { value: number }) => {
          const montant = typeof value === 'number' ? value : parseFloat(value); // Conversion en nombre
          return isNaN(montant) ? 'N/A' : montant.toFixed(2); // Affichage avec 2 décimales ou 'N/A'
        },
      },
      {
        Header: 'Détails',
        Cell: ({ row }: any) => (
          <Link href={`/invoices/${row.original.id}`} className="text-blue-500 underline hover:text-blue-700">
            Voir Détails
          </Link> // Lien vers les détails de la facture
        ),
      },
    ],
    []
  );

  // Configuration de react-table avec les hooks nécessaires
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
  
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // État initial avec le nombre de lignes par page
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, globalFilter } = state; // Extraction des états de pagination et de filtre global
  
  if (!isClient) return null; // Rendu conditionnel si le composant n'est pas exécuté côté client

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Liste des Factures</h1>

      {/* Barre de recherche */}
      <div className="flex justify-between items-center mb-4">
        <input
          value={globalFilter || ''} // Valeur de l'input liée au filtre global
          onChange={(e) => setGlobalFilter(e.target.value)} // Mise à jour du filtre global lors de la saisie
          placeholder="Rechercher..."
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      {/* Tableau */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-800 text-white">
                {headerGroup.headers.map((column) => {
                  // Attribution de la clé directement à th
                  const { key, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th key={key} {...columnProps} className="px-6 py-3 text-left font-semibold cursor-pointer">
                      <div className="flex items-center">
                        {column.render('Header')}
                        {/* Icône de tri */}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaSortDown className="ml-1" /> 
                          ) : (
                            <FaSortUp className="ml-1" /> 
                          )
                        ) : (
                          <FaSort className="ml-1" /> 
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div> 
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  Aucune facture trouvée. 
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row); // Préparation de la ligne pour le rendu
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-blue-100 transition-colors duration-200 ease-in-out"
                  >
                    {row.cells.map((cell) => {
                      // Attribution de la clé directement à td
                      const { key, ...cellProps } = cell.getCellProps();
                      return (
                        <td key={key} {...cellProps} className="px-6 py-4 border-b">
                          {cell.render('Cell')} 
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()} // Fonction pour aller à la page précédente
          disabled={!canPreviousPage} // Désactivation si aucune page précédente
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} sur {pageOptions.length}
          </strong>
        </span>
        <button
          onClick={() => nextPage()} // Fonction pour aller à la page suivante
          disabled={!canNextPage} // Désactivation si aucune page suivante
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Invoices; 
