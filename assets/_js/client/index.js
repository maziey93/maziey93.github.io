import logdown from 'logdown';
import initPreloader from './preloader';
import initSearch from './search';
import initModals from './modal';
import toggleHeaderMobileMenu from './header-mobile-menu-toggle';

/**
 * @description Stores references to DOM elements
 * @type {{
 *     header: HTMLElement,
 *     landingPage: HTMLElement
 * }}
 */
const DOM = {};

((global, logger) => {
    const { document } = global;

    document.addEventListener('DOMContentLoaded', () => {

        initPreloader(global);

        toggleHeaderMobileMenu(global);

        initModals(global);

        initSearch(global, logger);

        DOM.header = global.document.querySelector('#header');
        DOM.landingPage = global.document.querySelector('.ns-landing-screen');

        // function to handle header transition on landing page
        if (DOM.landingPage) {
            (async () => {
                const { default: animateHeader } = await import(/* webpackChunkName: "animate-landing-header" */ './animate-header');
                animateHeader(global, { header: DOM.header, landingPage: DOM.landingPage });
            })();
        }

        // Do page view tracking
        if (global.ga) {
            global.ga('send', {
                hitType: 'pageview',
                page: global.location.pathname,
            });
        }
    });
})(window, logdown('eoe'));
