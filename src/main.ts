import { renderRoute } from './app/router';
import './styles.css';

const root = document.getElementById('app')!;
const render = () => renderRoute(root, location.hash);
window.addEventListener('hashchange', render);
render();
