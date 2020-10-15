import throttle from 'lodash.throttle';
import { Component } from 'gia';
import logger from './utils/logger';
import { SEARCH_REQ } from '../constants';
import { hasClass, toggleClass, sendWorkerMessage } from './utils';

type SearchResultItem = { url: string; title: string; category: string };

type SearchRequestResponse = {
  data: SearchResultItem[];
};

const headerDOM = {} as {
  searchInputField: Element;
  loadingIndicator: HTMLElement | null;
};

type NavigationState = {
  searchResult: SearchResultItem[] | null;
  searchResultLoading: boolean;
};

type NavigationRefs = {
  mobileMenuToggle: HTMLElement[];
  searchForm: HTMLFormElement[];
  searchResultContainer: HTMLElement[];
}

export default class NavigationComponent extends Component<NavigationState, NavigationRefs> {
  constructor(element: HTMLElement) {
    super(element);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.ref = {}
  }

  headerSearchActive = (): boolean =>
    this.element.hasAttribute('search-expanded');

  setHeaderSearchActive = (): void =>
    this.element.setAttribute('search-expanded', '');

  setHeaderSearchDisabled = (): void =>
    this.element.removeAttribute('search-expanded');

  searchRequest = (searchText: string): Promise<SearchRequestResponse> =>
    sendWorkerMessage({
      command: SEARCH_REQ,
      key: searchText,
    });

  renderSearchResultItem = (result: SearchResultItem): string => `
      <a href="${result.url}" class="search__results__item">
         <p class="search__results__item__title">${result.title}</p>
         <p class="search__results__item__category endnote_ts">${result.category}</p>
      </a>
    `;

  insertContentInSearchContainer = (content: HTMLElement | DocumentFragment): void => {
    const [ searchResultsContainer ] = this.ref.searchResultContainer;
    // replace existing content with new one if they exist
    if (searchResultsContainer.firstChild) {
      searchResultsContainer.replaceChild(
        content,
        searchResultsContainer.firstChild
      );
    } else {
      searchResultsContainer.appendChild(content);
    }
  };

  setLoadingIndicator(): void {
    const [ searchResultsContainer ] = this.ref.searchResultContainer;

    // checks if the reference to our loading indicator is still in the DOM
    if (headerDOM.loadingIndicator?.parentElement) return;

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'container js-loading-indicator';
    loadingIndicator.textContent = 'Loading...';

    // replace search results with loader if they exist
    this.insertContentInSearchContainer(loadingIndicator);

    // make a reference for the just created loading indicator
    headerDOM.loadingIndicator = searchResultsContainer.querySelector(
      '.js-loading-indicator'
    ) as HTMLElement;
  }

  displaySearchResult(searchResult: SearchResultItem[]): void {
    if (!searchResult.length) {
      throw new Error('no results!');
    }

    // build search result
    const fragment = document.createDocumentFragment();
    const searchItemsWrapper = document.createElement('ul');
    searchItemsWrapper.className =
      'container js-search-result-list search-result-list';

    searchResult.reduce((acc, cur) => {
      const li = document.createElement('li');
      li.innerHTML = this.renderSearchResultItem(cur);
      searchItemsWrapper.appendChild(li);
      return searchItemsWrapper;
    }, searchItemsWrapper);

    fragment.appendChild(searchItemsWrapper);

    // insert search result into DOM
    this.insertContentInSearchContainer(fragment);
  }

  displaySearchError = (err: typeof Error): void => {
    logger.warn(err);
  };

  handleSearch = throttle<EventListener>((evt: Event) => {
    evt.preventDefault();
    const searchText = (<HTMLInputElement>evt.target).value;

    if (!searchText) return;

    // Set loading visual cue
    this.setState({
      searchResultLoading: true,
    })

    this.searchRequest(searchText)
      .then(({ data }) => this.setState({
        searchResult: data,
        searchResultLoading: false,
      }))
      .catch(this.displaySearchError);
  }, 250);

  animateLandingPageHeader = (landingPage: Element): void => {
    const toggleBoundary = 10;
    const classToToggle = 'ns-header--hidden';

    const landingPageContent = landingPage.querySelector(
      '.main-content'
    ) as Element;

    landingPage.addEventListener(
      'scroll',
      throttle(() => {
        const contentRect = landingPageContent.getBoundingClientRect();
        const classIsSet = hasClass(this.element, classToToggle);

        requestAnimationFrame(() => {
          if (classIsSet && contentRect.y < toggleBoundary) {
            toggleClass(this.element, classToToggle, false);
          }

          if (!classIsSet && contentRect.y > toggleBoundary) {
            if (this.headerSearchActive()) {
              this.setHeaderSearchDisabled();
            }
            toggleClass(this.element, classToToggle, true);
          }
        });
      }, 250)
    );
  };

  stateChange(stateChanges: Partial<NavigationState>): void {
    if('searchResultLoading' in stateChanges && Boolean(stateChanges.searchResultLoading)) {
      this.setLoadingIndicator();
    }

    if(stateChanges.searchResult) {
      this.displaySearchResult(stateChanges.searchResult)
    }
  }

  mount(): void {
    const [ searchForm ] = this.ref.searchForm;
    const [ searchResultsContainer ] = this.ref.searchResultContainer;
    const landingPage = document.querySelector('.ns-landing-screen');

    headerDOM.searchInputField = searchForm.elements.namedItem('searchInput') as Element;
    headerDOM.loadingIndicator = null;

    const [ MOBILE_TOGGLE ] = this.ref?.mobileMenuToggle;

    if (landingPage) {
      this.animateLandingPageHeader(landingPage);
    }

    searchForm.addEventListener('click', () => {
      if (!this.headerSearchActive()) {
        this.setHeaderSearchActive();
      }
    });

    // close search if open and
    // the click target is not a descendant of the host element
    document.addEventListener('click', (evt) => {
      if (this.headerSearchActive() && !searchForm.contains(evt?.target as Node)) {
        this.setHeaderSearchDisabled();
        searchResultsContainer.textContent = '';
      }
    });

    searchForm.addEventListener('submit', this.handleSearch);
    headerDOM.searchInputField.addEventListener('input', this.handleSearch);

    // initialize handler for mobile toggle
    MOBILE_TOGGLE?.addEventListener('click', () => {
      const openClassName = 'mobile-toggle--open';

      toggleClass(
        MOBILE_TOGGLE,
        openClassName,
        !hasClass(MOBILE_TOGGLE, openClassName)
      );
    });
  }
}