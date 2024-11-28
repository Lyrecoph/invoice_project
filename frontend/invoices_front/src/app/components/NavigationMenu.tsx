import Link from 'next/link';

const NavigationMenu: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="nav-link">
            Accueil
          </Link>
        </li>
        <li>
          <Link href="/upload" className="nav-link">
            Téléchargement
          </Link>
        </li>
        <li>
          <Link href="/invoices" className="nav-link">
            Factures
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
