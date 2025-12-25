"use client";

import Script from "next/script";

interface AnalyticsScriptsProps {
  /**
   * Google Ads conversion tracking ID
   * @default 'AW-17695424239'
   */
  googleAdsId?: string;

  /**
   * DataFast website ID for analytics
   * @default 'dfid_eTpQ5NjrKpI9SsZkJ4rgy'
   */
  dataFastId?: string;

  /**
   * DataFast domain for analytics
   * @default 'certfast.com'
   */
  dataFastDomain?: string;

  /**
   * PostHog project API key
   * @default 'phc_z9UVM3S4rx4oG2UE2uQGCkOH6JnhAwvqAZnU91lRKkV'
   */
  posthogKey?: string;

  /**
   * PostHog API host
   * @default 'https://us.i.posthog.com'
   */
  posthogHost?: string;

  /**
   * Enable debug mode for development
   * @default false
   */
  debug?: boolean;
}

export function AnalyticsScripts({
  googleAdsId = "AW-17695424239",
  dataFastId = "dfid_eTpQ5NjrKpI9SsZkJ4rgy",
  dataFastDomain = "certfast.com",
  posthogKey = "phc_z9UVM3S4rx4oG2UE2uQGCkOH6JnhAwvqAZnU91lRKkV",
  posthogHost = "https://us.i.posthog.com",
  debug = process.env.NODE_ENV === "development",
}: AnalyticsScriptsProps) {
  return (
    <>
      {/* ✅ Google Ads Global Tag */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
      />
      <Script id="google-ads-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAdsId}');
        `}
      </Script>

      {/* ✅ DataFast Analytics */}
      <Script
        data-website-id={dataFastId}
        data-domain={dataFastDomain}
        src="https://datafa.st/js/script.js"
        strategy="afterInteractive"
        data-allow-localhost="true"
      />

      {/* ✅ PostHog Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://us.i.posthog.com/static/array.js"
      />
      <Script id="posthog-config" strategy="afterInteractive">
        {`
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Rr Mr fi Cr Ar ci Tr Fr capture Mi calculateEventProperties Lr register register_once register_for_session unregister unregister_for_session Hr getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Ur jr createPersonProfile zr kr Br opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Dr debug M Nr getPageViewId captureTraceFeedback captureTraceMetric $r".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

          posthog.init('${posthogKey}', {
            api_host: '${posthogHost}',
            defaults: '2025-05-24',
            person_profiles: 'identified_only',
            loaded: function(posthog) {
              if (${debug}) {
                posthog.debug();
              }
            }
          });
        `}
      </Script>
    </>
  );
}
