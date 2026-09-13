import PageContentContainer from "@/components/layout/PageContentContainer";
import { getThemeColorCss } from "@/styles/themeColors";
import {
  DEFAULT_SEARCH_GRID_STYLE,
  SECTION_PADDING_CLASS,
} from "../utils/style";
import FilterTabs from "./FilterTabs";
import SearchFields from "./SearchFields";
import SearchPagination from "./SearchPagination";
import SightCardsGrid from "./SightCardsGrid";

export default function SearchWithTabsAndGridPanel({
  lang = "en",
  posParams = "gb",
  cId,
  content,
  search,
  style = DEFAULT_SEARCH_GRID_STYLE,
}) {
  const isRtl = lang === "ar";
  const paddingClass =
    SECTION_PADDING_CLASS[style.sectionPadding] ??
    SECTION_PADDING_CLASS.default;

  return (
    <section
      className={`relative w-full overflow-hidden ${paddingClass}`}
      dir={isRtl ? "rtl" : "ltr"}
      style={
        style.showSectionBg
          ? { backgroundColor: getThemeColorCss(style.sectionBg, "main") }
          : undefined
      }
    >
      <PageContentContainer>
        <div ref={search.componentTopRef} className="flex flex-col gap-6 md:gap-8">
          {style.showSearch ? (
            <div className="order-2 sm:order-1">
              <SearchFields
                placeholder={content.searchPlaceholder}
                searchQuery={search.searchQuery}
                onSearchQueryChange={search.setSearchQuery}
                style={style}
              />
            </div>
          ) : null}

          {style.showTabs ? (
            <div className="order-1 sm:order-2">
              <FilterTabs
                filterNames={search.filterNames}
                filterIconMap={search.filterIconMap}
                activeFilter={search.activeFilter}
                onFilterChange={search.setActiveFilter}
                allLabel={content.allLabel}
                style={style}
              />
            </div>
          ) : null}

          <div className="order-3">
            <SightCardsGrid
              lang={lang}
              posParams={posParams}
              cId={cId}
              gridTitle={content.gridTitle}
              links={content.links || []}
              exploreLabel={content.exploreLabel}
              exploreMagazineLabel={content.exploreMagazineLabel}
              paginatedCards={search.paginatedCards}
              activePageIndex={search.activePageIndex}
              style={style}
            />
          </div>

          <div className="order-4">
            <SearchPagination
              pageCount={search.pageCount}
              activePageIndex={search.activePageIndex}
              onPrev={search.handlePrevPage}
              onNext={search.handleNextPage}
              onGoToPage={search.setActivePageIndex}
              style={style}
            />
          </div>
        </div>
      </PageContentContainer>
    </section>
  );
}
