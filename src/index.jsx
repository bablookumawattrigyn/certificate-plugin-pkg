/** Styles are bundled and injected when this package is imported (no separate CSS import in host apps). */
import './styles/certificate-app.scss';

export { TemplateList } from './widgets/TemplateListWidget';
export { CertificateList } from './widgets/CertificateListWidget';
export { CertificateShell } from './shell/CertificateShell';
export { default } from './CertificatePlugin.jsx';
export { CertificateModuleRoutes } from './vendor-certificate-module/CertificateModuleRoutes';
export { AppProvider } from './vendor-certificate-module/context/AppContext';
