import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Pour des assertions supplémentaires
import Home from '../page'; // Chemin du composant Home
import { RouterContext } from 'next/dist/shared/lib/router-context'; // Pour simuler le routing Next.js
import mockRouter from 'next-router-mock';
import { createMockRouter } from './test-utils'; // Utilitaire pour simuler un routeur Next.js
jest.mock('next-router-mock');
describe('Home Component', () => {
  it('should render the main heading', () => {
    mockRouter.push('/');
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Home />
      </RouterContext.Provider>
    );
    const heading = screen.getByRole('heading', {
      name: /Bienvenue sur votre application générateur de factures à partir de CSV\/Excel/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render the upload link card', () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Home />
      </RouterContext.Provider>
    );
    const uploadCard = screen.getByRole('heading', {
      name: /Upload de Fichiers/i,
    });
    expect(uploadCard).toBeInTheDocument();
  });

  it('should render the invoices link card', () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Home />
      </RouterContext.Provider>
    );
    const invoicesCard = screen.getByRole('heading', {
      name: /Consulter les Factures/i,
    });
    expect(invoicesCard).toBeInTheDocument();
  });

  it('should render the "Nouvelles Fonctionnalités" section', () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Home />
      </RouterContext.Provider>
    );
    const featuresSection = screen.getByRole('heading', {
      name: /Nouvelles Fonctionnalités/i,
    });
    expect(featuresSection).toBeInTheDocument();
  });
});
