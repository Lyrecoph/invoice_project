// src/types/types.ts
export interface Invoice {
    id: number;
    numero: string;
    nom_client: string;
    montant_total: number;
  }

  
export  interface InvoiceDetails {
    id: number;
    numero: string;
    nom_client: string;
    montant_total: number;
    articles: {
      description: string;
      quantite: number;
      prix: number;
      prix_total: number;
    }[];
  }
  