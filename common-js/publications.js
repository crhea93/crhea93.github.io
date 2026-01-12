// ADS API Configuration
const ADS_API_KEY = "TUhSWd2xbsM6sSP9zVdvZBVNgYmS0m188x1mlKup";
const ADS_API_URL = "https://api.adsabs.harvard.edu/v1/search/query";
const AUTHOR_NAME = "Rhea, Carter";

// Publication Manager
class PublicationManager {
  constructor() {
    this.publications = [];
    this.filteredPublications = [];
    this.currentFilter = "all";
    this.currentSort = "date-desc";
  }

  async fetchPublications() {
    try {
      // Try to load from pre-generated JSON file first
      const response = await fetch("data/publications.json");

      if (!response.ok) {
        throw new Error(`Failed to load publications: ${response.status}`);
      }

      const publications = await response.json();
      this.publications = publications;
      this.filteredPublications = [...this.publications];
      return this.publications;
    } catch (error) {
      console.error("Error fetching publications:", error);
      throw error;
    }
  }

  transformPublication(doc) {
    const isFirstAuthor = doc.first_author === AUTHOR_NAME;
    const authorIndex = doc.author
      ? doc.author.findIndex((a) => a.includes("Rhea"))
      : -1;

    return {
      title: doc.title ? doc.title[0] : "Untitled",
      authors: doc.author || [],
      year: doc.year,
      date: doc.pubdate,
      bibcode: doc.bibcode,
      citations: doc.citation_count || 0,
      abstract: doc.abstract || "",
      journal: doc.pub || "Unknown",
      isFirstAuthor: isFirstAuthor,
      authorPosition: authorIndex + 1,
      adsUrl: `https://ui.adsabs.harvard.edu/abs/${doc.bibcode}/abstract`,
      doctype: doc.doctype || "article",
    };
  }

  filterPublications(filterType) {
    this.currentFilter = filterType;

    switch (filterType) {
      case "first-author":
        this.filteredPublications = this.publications.filter(
          (p) => p.isFirstAuthor,
        );
        break;
      case "co-author":
        this.filteredPublications = this.publications.filter(
          (p) => !p.isFirstAuthor,
        );
        break;
      case "refereed":
        this.filteredPublications = this.publications.filter(
          (p) =>
            p.doctype === "article" &&
            !p.journal.toLowerCase().includes("arxiv"),
        );
        break;
      default:
        this.filteredPublications = [...this.publications];
    }

    this.sortPublications(this.currentSort);
    return this.filteredPublications;
  }

  sortPublications(sortType) {
    this.currentSort = sortType;

    switch (sortType) {
      case "date-desc":
        this.filteredPublications.sort((a, b) => b.year - a.year);
        break;
      case "date-asc":
        this.filteredPublications.sort((a, b) => a.year - b.year);
        break;
      case "citations":
        this.filteredPublications.sort((a, b) => b.citations - a.citations);
        break;
      case "title":
        this.filteredPublications.sort((a, b) =>
          a.title.localeCompare(b.title),
        );
        break;
    }

    return this.filteredPublications;
  }

  searchPublications(searchTerm) {
    const term = searchTerm.toLowerCase();
    this.filteredPublications = this.publications.filter(
      (pub) =>
        pub.title.toLowerCase().includes(term) ||
        pub.authors.some((a) => a.toLowerCase().includes(term)) ||
        pub.journal.toLowerCase().includes(term) ||
        pub.abstract.toLowerCase().includes(term),
    );
    return this.filteredPublications;
  }

  getStatistics() {
    return {
      total: this.publications.length,
      firstAuthor: this.publications.filter((p) => p.isFirstAuthor).length,
      totalCitations: this.publications.reduce(
        (sum, p) => sum + p.citations,
        0,
      ),
      hIndex: this.calculateHIndex(),
    };
  }

  calculateHIndex() {
    const citations = this.publications
      .map((p) => p.citations)
      .sort((a, b) => b - a);

    let hIndex = 0;
    for (let i = 0; i < citations.length; i++) {
      if (citations[i] >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }
    return hIndex;
  }
}

// UI Renderer
class PublicationUI {
  constructor(manager) {
    this.manager = manager;
  }

  showLoading() {
    const container = document.getElementById("publications-container");
    container.innerHTML = `
            <div class="loading-state">
                ${this.createSkeletonCards(6)}
            </div>
        `;
  }

  createSkeletonCards(count) {
    return Array(count)
      .fill(0)
      .map(
        () => `
            <div class="publication-card skeleton">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-authors"></div>
                <div class="skeleton-line skeleton-journal"></div>
            </div>
        `,
      )
      .join("");
  }

  renderStatistics(stats) {
    const statsContainer = document.getElementById("publication-stats");
    if (!statsContainer) return;

    statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Publications</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.firstAuthor}</div>
                    <div class="stat-label">First Author</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.totalCitations}</div>
                    <div class="stat-label">Total Citations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.hIndex}</div>
                    <div class="stat-label">h-index</div>
                </div>
            </div>
        `;
  }

  renderPublications(publications) {
    const container = document.getElementById("publications-container");

    if (publications.length === 0) {
      container.innerHTML = `
                <div class="no-results">
                    <i class="icon ion-ios-search"></i>
                    <h3>No publications found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
      return;
    }

    container.innerHTML = publications
      .map((pub) => this.createPublicationCard(pub))
      .join("");

    // Add click listeners for expand buttons
    this.attachEventListeners();
  }

  createPublicationCard(pub) {
    const authorList = this.formatAuthors(pub.authors);
    const badge = pub.isFirstAuthor
      ? '<span class="author-badge first-author">First Author</span>'
      : `<span class="author-badge co-author">Co-Author (${this.getPositionSuffix(pub.authorPosition)})</span>`;

    return `
            <div class="publication-card" data-bibcode="${pub.bibcode}">
                <div class="pub-header">
                    <h3 class="pub-title">
                        <a href="${pub.adsUrl}" target="_blank" rel="noopener">${pub.title}</a>
                    </h3>
                    ${badge}
                </div>

                <div class="pub-authors">${authorList}</div>

                <div class="pub-meta">
                    <span class="pub-journal"><i class="icon ion-ios-book"></i> ${pub.journal}</span>
                    <span class="pub-year"><i class="icon ion-ios-calendar"></i> ${pub.year}</span>
                    <span class="pub-citations"><i class="icon ion-ios-star"></i> ${pub.citations} citations</span>
                </div>

                <div class="pub-abstract collapsed" id="abstract-${pub.bibcode}">
                    <p>${pub.abstract || "No abstract available."}</p>
                </div>

                <div class="pub-actions">
                    <button class="btn-expand" onclick="toggleAbstract('${pub.bibcode}')">
                        <i class="icon ion-ios-arrow-down"></i> Show Abstract
                    </button>
                    <a href="${pub.adsUrl}" class="btn-ads" target="_blank" rel="noopener">
                        <i class="icon ion-ios-link"></i> View in ADS
                    </a>
                </div>
            </div>
        `;
  }

  formatAuthors(authors) {
    if (!authors || authors.length === 0) return "Unknown authors";

    const formatted = authors.map((author) => {
      if (author.includes("Rhea")) {
        return `<strong class="author-highlight">${author}</strong>`;
      }
      return author;
    });

    if (formatted.length <= 5) {
      return formatted.join(", ");
    }

    return (
      formatted.slice(0, 3).join(", ") +
      ` <em>et al.</em> (${authors.length} authors)`
    );
  }

  getPositionSuffix(position) {
    if (position === 1) return "1st";
    if (position === 2) return "2nd";
    if (position === 3) return "3rd";
    return `${position}th`;
  }

  attachEventListeners() {
    // Event listeners are handled by global functions
  }

  showError(error) {
    const container = document.getElementById("publications-container");
    container.innerHTML = `
            <div class="error-state">
                <i class="icon ion-ios-alert"></i>
                <h3>Error Loading Publications</h3>
                <p>${error.message}</p>
                <button class="btn-retry" onclick="initPublications()">Try Again</button>
            </div>
        `;
  }
}

// Global functions for event handling
function toggleAbstract(bibcode) {
  const abstract = document.getElementById(`abstract-${bibcode}`);
  const button = event.target.closest(".btn-expand");

  if (abstract.classList.contains("collapsed")) {
    abstract.classList.remove("collapsed");
    button.innerHTML = '<i class="icon ion-ios-arrow-up"></i> Hide Abstract';
  } else {
    abstract.classList.add("collapsed");
    button.innerHTML = '<i class="icon ion-ios-arrow-down"></i> Show Abstract';
  }
}

// Global instance
let pubManager;
let pubUI;

// Initialize
async function initPublications() {
  pubManager = new PublicationManager();
  pubUI = new PublicationUI(pubManager);

  pubUI.showLoading();

  try {
    await pubManager.fetchPublications();
    const stats = pubManager.getStatistics();

    pubUI.renderStatistics(stats);
    pubUI.renderPublications(pubManager.filteredPublications);

    // Setup event listeners
    setupFilters();
    setupSearch();
  } catch (error) {
    pubUI.showError(error);
  }
}

function setupFilters() {
  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filterType = this.dataset.filter;
      const filtered = pubManager.filterPublications(filterType);
      pubUI.renderPublications(filtered);
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      pubManager.sortPublications(this.value);
      pubUI.renderPublications(pubManager.filteredPublications);
    });
  }
}

function setupSearch() {
  const searchInput = document.getElementById("publication-search");
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (this.value.trim() === "") {
          pubManager.filterPublications(pubManager.currentFilter);
        } else {
          pubManager.searchPublications(this.value);
        }
        pubUI.renderPublications(pubManager.filteredPublications);
      }, 300);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPublications);
} else {
  initPublications();
}
