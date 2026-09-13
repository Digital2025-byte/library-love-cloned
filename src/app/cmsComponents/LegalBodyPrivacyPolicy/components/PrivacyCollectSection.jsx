import { typography } from "@/styles/typography";
import Introduction from "./Introduction";
import List from "./List";

export default function PrivacyCollectSection({ section, infoCollectedLabel }) {
  if (!section) {
    return null;
  }

  const personal = section.personalInformation;
  const automatic = section.informationAutomaticallyCollected;
  const dataTypes = Array.isArray(automatic?.dataTypes)
    ? automatic.dataTypes
    : [];

  return (
    <Introduction title={section.title}>
      <div className="space-y-6">
        {personal ? (
          <div>
            {personal.title ? (
              <h3
                className={`${typography.itemTitle} mb-3 font-medium text-primary-1`}
              >
                {personal.title}
              </h3>
            ) : null}
            {personal.subtitle ? (
              <p className={`${typography.body} mb-4 font-semibold text-700`}>
                {personal.subtitle}
              </p>
            ) : null}
            {personal.description ? (
              <p className={`${typography.body} mb-4 text-700`}>
                {personal.description}
              </p>
            ) : null}
            <List
              title={personal.personalInfoProvided?.title}
              description={personal.personalInfoProvided?.description}
              items={personal.personalInfoProvided?.items}
            />
            {personal.sensitiveInformation ? (
              <div className="mb-4">
                <h4
                  className={`${typography.itemTitle} mb-2 font-medium text-primary-1`}
                >
                  {personal.sensitiveInformation.title}
                </h4>
                <p className={`${typography.body} text-700`}>
                  {personal.sensitiveInformation.description}
                </p>
              </div>
            ) : null}
            {personal.paymentData ? (
              <div className="mb-4">
                <h4
                  className={`${typography.itemTitle} mb-2 font-medium text-primary-1`}
                >
                  {personal.paymentData.title}
                </h4>
                <p className={`${typography.body} text-700`}>
                  {personal.paymentData.description}
                </p>
              </div>
            ) : null}
            {personal.socialMediaLoginData ? (
              <div className="mb-4">
                <h4
                  className={`${typography.itemTitle} mb-2 font-medium text-primary-1`}
                >
                  {personal.socialMediaLoginData.title}
                </h4>
                <p className={`${typography.body} text-700`}>
                  {personal.socialMediaLoginData.description}
                </p>
              </div>
            ) : null}
            {personal.note ? (
              <p className={`${typography.body} mt-4 font-medium text-700`}>
                {personal.note}
              </p>
            ) : null}
          </div>
        ) : null}

        {automatic ? (
          <div className="mt-6 rounded-lg bg-100 p-6 md:p-8">
            {automatic.title ? (
              <h3
                className={`${typography.itemTitle} mb-3 font-medium text-primary-1`}
              >
                {automatic.title}
              </h3>
            ) : null}
            {automatic.subtitle ? (
              <p className={`${typography.body} mb-4 font-semibold text-700`}>
                {automatic.subtitle}
              </p>
            ) : null}
            {automatic.description ? (
              <p className={`${typography.body} mb-6 text-700`}>
                {automatic.description}
              </p>
            ) : null}
            {dataTypes.length ? (
              <div className="space-y-4">
                <p className={`${typography.body} mb-2 font-semibold text-700`}>
                  {infoCollectedLabel || "The information we collect includes:"}
                </p>
                {dataTypes.map((dataType, index) => (
                  <div key={dataType.title || index} className="mb-4">
                    <h4
                      className={`${typography.itemTitle} mb-2 font-medium text-primary-1`}
                    >
                      {dataType.title}
                    </h4>
                    <p className={`${typography.body} text-700`}>
                      {dataType.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Introduction>
  );
}
