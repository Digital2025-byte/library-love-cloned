"use client";

import CarouselCardMedia from "./components/CarouselCardMedia";
import CarouselCardPanel from "./components/CarouselCardPanel";
import CarouselCardShell from "./components/CarouselCardShell";
import { getImageSrc, getOriginLabel, getStackLayout } from "./utils/helpers";

export default function CarouselCard({
  IATACode,
  imageUrl,
  imageAlt,
  numberOfFlightsPerWeek,
  duration,
  cityName,
  description,
  descriptionParts,
  linkStyle,
  showLinks = true,
  subtitle,
  buttonLabel,
  isActive,
  stackIndex,
  direction,
  isLeaving,
  isEntering,
  onSelect,
  onDragEnd,
  posParams,
  lang,
  showImage = true,
  showCity = true,
  showOrigin = true,
  showNew = true,
  showFlights = true,
  showDuration = true,
  showDescription = true,
  showPanel = true,
  showInactiveDim = true,
  showButton = true,
  cityColor = "50",
  originColor = "50",
  originBg = "900",
  metaColor = "50",
  bodyColor = "50",
  panelBg = "secondary-2",
  overlayColor = "secondary-2",
  buttonBg = "main",
  buttonText = "white",
  cardRadiusClass = "rounded-3xl",
  panelRadiusClass = "rounded-b-3xl",
}) {
  const { hidden, baseTransform, safeZIndex } = getStackLayout(stackIndex);
  const originLabel = getOriginLabel(subtitle);
  const src = getImageSrc(imageUrl);

  return (
    <CarouselCardShell
      isActive={isActive}
      hidden={hidden}
      safeZIndex={safeZIndex}
      onSelect={onSelect}
      onDragEnd={onDragEnd}
      isEntering={isEntering}
      isLeaving={isLeaving}
      direction={direction}
      baseTransform={baseTransform}
      radiusClass={cardRadiusClass}
    >
      <CarouselCardMedia
        src={src}
        cityName={cityName}
        imageAlt={imageAlt}
        isActive={isActive}
        showImage={showImage}
        showInactiveDim={showInactiveDim}
        overlayColor={overlayColor}
      />
      <CarouselCardPanel
          cityName={cityName}
          originLabel={originLabel}
          IATACode={IATACode}
          posParams={posParams}
          lang={lang}
          numberOfFlightsPerWeek={numberOfFlightsPerWeek}
          duration={duration}
          description={description}
          descriptionParts={descriptionParts}
          linkStyle={linkStyle}
          showLinks={showLinks}
          buttonLabel={buttonLabel}
          showCity={showCity}
          showOrigin={showOrigin}
          showNew={showNew}
          showFlights={showFlights}
          showDuration={showDuration}
          showDescription={showDescription}
          showButton={showButton}
          showPanel={showPanel}
          cityColor={cityColor}
          originColor={originColor}
          originBg={originBg}
          metaColor={metaColor}
          bodyColor={bodyColor}
          panelBg={panelBg}
          buttonBg={buttonBg}
          buttonText={buttonText}
          panelRadiusClass={panelRadiusClass}
        />
    </CarouselCardShell>
  );
}
