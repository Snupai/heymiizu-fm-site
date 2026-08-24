import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import styles from "../imprint/imprint.module.css";

export const metadata: Metadata = {
  title: "Privacy — Miizu",
  description:
    "Privacy information for the Miizu website, contact form, analytics, and administration features.",
};

const externalLinkProps = {
  rel: "noopener noreferrer",
  target: "_blank",
} as const;

export default function PrivacyPage() {
  return (
    <main className={styles.imprintMain}>
      <header className={styles.header}>
        <Link className={styles.backLink} href="/">
          <ArrowLeft aria-hidden="true" />
          <span className={styles.backLinkText}>back</span>
        </Link>
      </header>

      <div className={styles.content}>
        <h1 className={styles.imprintH1} id="privacy">
          Privacy Policy
        </h1>
        <p className={styles.notice}>
          Last updated: <time dateTime="2026-08-24">24 August 2026</time>. This
          notice describes the data processing performed by the current version
          of this website.
        </p>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Controller</h2>
          <p>
            The website operator named in the{" "}
            <Link href="/imprint">imprint</Link> is responsible for the
            processing described here. Privacy questions and requests can be
            sent to <a href="mailto:nya@snupai.me">nya@snupai.me</a>.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Website delivery and hosting</h2>
          <p>
            The website is hosted on Vercel. When a page or file is requested,
            hosting infrastructure necessarily processes technical connection
            information such as the IP address, request time, requested URL,
            referrer, user agent, and request status so that the website can be
            delivered securely and reliably. This processing is based on our
            legitimate interests in operating, protecting, and troubleshooting
            the website under Article 6(1)(f) GDPR.
          </p>
          <p>
            Where the hosting platform supplies a country code derived from the
            request, the application uses it only to pre-select Local Germany or
            International in the contact form. The application does not persist
            the raw country header. If an inquiry is submitted, the selected
            region is included with that inquiry.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Audience measurement</h2>
          <p>
            We use Simple Analytics to understand aggregate website usage. Its
            script may process the page URL, referrer, campaign parameters, time
            zone, browser language, user agent, viewport and screen dimensions,
            page-load information, and scroll depth. According to Simple
            Analytics, it does not set cookies or use local storage, retain or
            hash IP addresses, create visitor identifiers, or fingerprint
            devices. See the provider&apos;s{" "}
            <a
              href="https://docs.simpleanalytics.com/data-collection"
              {...externalLinkProps}
            >
              data collection documentation
            </a>
            .
          </p>
          <p>
            We also use Vercel Web Analytics for anonymous page-view statistics.
            Vercel states that the service does not use third-party cookies and
            derives a temporary visitor hash from the incoming request, which is
            discarded after 24 hours. Analytics data may include the visited
            URL, filtered query parameters, referrer, approximate location,
            browser, operating system, device type, event time, and analytics
            script version. See Vercel&apos;s{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              {...externalLinkProps}
            >
              Web Analytics privacy documentation
            </a>
            .
          </p>
          <p>
            These services are used to evaluate aggregate traffic and improve
            the website. The legal basis is our legitimate interest in measuring
            and improving the public website under Article 6(1)(f) GDPR. We do
            not send contact-form fields to either analytics service.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Contact inquiries</h2>
          <p>
            When you submit the contact form, we process your name, email
            address, selected service, budget, project dates, region, and
            project description, together with any optional telephone number and
            referral information you provide. The server validates the
            submission, checks commission availability through Supabase, and
            sends the inquiry through the configured email provider. The
            application does not save inquiries in its database.
          </p>
          <p>
            The reported client IP address is used in volatile server memory to
            enforce a short submission rate limit. It is not included in the
            inquiry email or written to the application database. Inquiry emails
            are retained for as long as needed to respond, prepare or perform a
            potential engagement, resolve disputes, and meet applicable legal
            retention duties.
          </p>
          <p>
            Processing requested before entering into a contract is based on
            Article 6(1)(b) GDPR. General correspondence, abuse prevention, and
            the protection of the contact service are based on Article 6(1)(f)
            GDPR.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Accounts and administration</h2>
          <p>
            The non-public account and administration features use Supabase for
            authentication and data storage. When those features are used,
            Supabase processes the supplied email address and authentication
            data. The browser client persists authentication session information
            in local storage so that signed-in sessions can continue and
            refresh. Administrative content and role information are stored in
            the connected Supabase project.
          </p>
          <p>
            This processing is necessary to provide requested account access
            under Article 6(1)(b) GDPR and serves our legitimate interest in
            protecting and administering restricted features under Article
            6(1)(f) GDPR. Account information is retained while the account is
            active and as otherwise required to secure the service or comply
            with legal duties.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Service providers and transfers</h2>
          <p>
            Technical data may be processed on our behalf by Vercel, Simple
            Analytics, Supabase, and the configured email delivery provider.
            These providers process data under their own technical and
            contractual safeguards. Where data is processed outside the European
            Economic Area, the applicable provider safeguards and transfer
            mechanisms are used.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>External links</h2>
          <p>
            Links to social networks and other external websites are ordinary
            links. Data is sent to those providers only after you follow a link;
            their own privacy notices then apply.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Your rights</h2>
          <p>
            Subject to the conditions of the GDPR, you may request access,
            rectification, erasure, restriction of processing, data portability,
            or object to processing based on legitimate interests. You may also
            lodge a complaint with a competent data protection supervisory
            authority. To exercise your rights, contact{" "}
            <a href="mailto:nya@snupai.me">nya@snupai.me</a>.
          </p>
        </section>

        <section className={styles.imprintSection}>
          <h2 className={styles.imprintH2}>Changes to this notice</h2>
          <p>
            We update this notice when the website, its providers, or applicable
            legal requirements change. The date at the top identifies the
            current version.
          </p>
        </section>

        <hr className={styles.divider} />

        <div lang="de">
          <h1 className={styles.imprintH1} id="datenschutz">
            Datenschutzerklärung
          </h1>
          <p className={styles.notice}>
            Stand: <time dateTime="2026-08-24">24. August 2026</time>. Diese
            Erklärung beschreibt die Datenverarbeitung durch die aktuelle
            Version dieser Website.
          </p>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Verantwortlicher</h2>
            <p>
              Verantwortlich für die hier beschriebene Verarbeitung ist der im{" "}
              <Link href="/imprint">Impressum</Link> genannte
              Webseitenbetreiber. Fragen und Anfragen zum Datenschutz können an{" "}
              <a href="mailto:nya@snupai.me">nya@snupai.me</a> gerichtet werden.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Bereitstellung und Hosting</h2>
            <p>
              Die Website wird bei Vercel gehostet. Beim Abruf einer Seite oder
              Datei verarbeitet die Hosting-Infrastruktur technisch notwendige
              Verbindungsdaten wie IP-Adresse, Zeitpunkt, aufgerufene URL,
              Referrer, User-Agent und Anfragestatus, um die Website sicher und
              zuverlässig bereitzustellen. Rechtsgrundlage ist unser
              berechtigtes Interesse am Betrieb, Schutz und der Fehleranalyse
              der Website gemäß Art. 6 Abs. 1 lit. f DSGVO.
            </p>
            <p>
              Stellt die Hosting-Plattform einen aus der Anfrage abgeleiteten
              Ländercode bereit, wird dieser ausschließlich zur Vorauswahl von
              „Local Germany“ oder „International“ im Kontaktformular verwendet.
              Die Anwendung speichert den ursprünglichen Länder-Header nicht.
              Wird eine Anfrage abgesendet, ist die ausgewählte Region
              Bestandteil der Anfrage.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Reichweitenmessung</h2>
            <p>
              Wir verwenden Simple Analytics zur aggregierten Auswertung der
              Websitenutzung. Das Skript kann Seiten-URL, Referrer,
              Kampagnenparameter, Zeitzone, Browsersprache, User-Agent,
              Viewport- und Bildschirmgröße, Seitenladeinformationen und
              Scrolltiefe verarbeiten. Nach Angaben von Simple Analytics werden
              keine Cookies oder Local Storage eingesetzt, IP-Adressen weder
              gespeichert noch gehasht, keine Besucherkennungen erstellt und
              kein Geräte-Fingerprinting durchgeführt. Weitere Informationen
              enthält die{" "}
              <a
                href="https://docs.simpleanalytics.com/data-collection"
                {...externalLinkProps}
              >
                Dokumentation zur Datenerhebung
              </a>
              .
            </p>
            <p>
              Zusätzlich verwenden wir Vercel Web Analytics für anonyme
              Seitenaufrufstatistiken. Vercel gibt an, dass keine
              Drittanbieter-Cookies eingesetzt werden und aus der eingehenden
              Anfrage ein temporärer Besucher-Hash gebildet wird, der nach 24
              Stunden verworfen wird. Zu den Analysedaten können aufgerufene
              URL, gefilterte Query-Parameter, Referrer, ungefährer Standort,
              Browser, Betriebssystem, Gerätetyp, Ereigniszeit und Skriptversion
              gehören. Weitere Informationen enthält die{" "}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                {...externalLinkProps}
              >
                Datenschutzhinweis-Dokumentation von Vercel Web Analytics
              </a>
              .
            </p>
            <p>
              Die Dienste dienen der aggregierten Reichweitenmessung und
              Verbesserung der Website. Rechtsgrundlage ist unser berechtigtes
              Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO. Inhalte des
              Kontaktformulars werden nicht an diese Analysedienste übermittelt.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Kontaktanfragen</h2>
            <p>
              Beim Absenden des Kontaktformulars verarbeiten wir Name,
              E-Mail-Adresse, ausgewählte Leistung, Budget, Projektzeitraum,
              Region und Projektbeschreibung sowie eine freiwillig angegebene
              Telefonnummer und Information darüber, wie Sie auf uns aufmerksam
              geworden sind. Der Server prüft die Angaben und die Verfügbarkeit
              über Supabase und sendet die Anfrage über den konfigurierten
              E-Mail-Anbieter. Die Anwendung speichert Anfragen nicht in ihrer
              Datenbank.
            </p>
            <p>
              Die gemeldete Client-IP-Adresse wird im flüchtigen Serverspeicher
              zur Durchsetzung einer kurzen Sendebegrenzung verwendet. Sie wird
              weder in die Anfrage-E-Mail aufgenommen noch in die
              Anwendungsdatenbank geschrieben. Anfrage-E-Mails werden so lange
              aufbewahrt, wie dies zur Beantwortung, Anbahnung oder Durchführung
              eines möglichen Auftrags, zur Klärung von Streitfällen und zur
              Erfüllung gesetzlicher Aufbewahrungspflichten erforderlich ist.
            </p>
            <p>
              Vorvertragliche Anfragen werden auf Grundlage von Art. 6 Abs. 1
              lit. b DSGVO verarbeitet. Allgemeine Korrespondenz,
              Missbrauchsschutz und der Schutz des Kontaktangebots beruhen auf
              Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Konten und Administration</h2>
            <p>
              Die nicht öffentlichen Konto- und Administrationsfunktionen
              verwenden Supabase für Authentifizierung und Datenspeicherung. Bei
              ihrer Nutzung verarbeitet Supabase die angegebene E-Mail-Adresse
              und Authentifizierungsdaten. Der Browser-Client speichert
              Sitzungsinformationen im Local Storage, damit angemeldete
              Sitzungen fortgeführt und erneuert werden können. Administrative
              Inhalte und Rolleninformationen werden im verbundenen
              Supabase-Projekt gespeichert.
            </p>
            <p>
              Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO für den
              angeforderten Kontozugang und Art. 6 Abs. 1 lit. f DSGVO für unser
              berechtigtes Interesse am Schutz und an der Verwaltung
              zugriffsbeschränkter Funktionen. Kontodaten werden während der
              aktiven Nutzung und darüber hinaus nur aufbewahrt, soweit dies zur
              Absicherung des Dienstes oder zur Erfüllung gesetzlicher Pflichten
              erforderlich ist.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>
              Dienstleister und Übermittlungen
            </h2>
            <p>
              Technische Daten können in unserem Auftrag durch Vercel, Simple
              Analytics, Supabase und den konfigurierten E-Mail-Anbieter
              verarbeitet werden. Diese Anbieter setzen eigene technische und
              vertragliche Schutzmaßnahmen ein. Soweit Daten außerhalb des
              Europäischen Wirtschaftsraums verarbeitet werden, kommen die
              jeweils einschlägigen Garantien und Übermittlungsmechanismen des
              Anbieters zur Anwendung.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Externe Links</h2>
            <p>
              Verweise auf soziale Netzwerke und andere externe Websites sind
              normale Links. Daten werden erst an den jeweiligen Anbieter
              übermittelt, wenn Sie einen Link aufrufen; anschließend gelten
              dessen eigene Datenschutzhinweise.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Ihre Rechte</h2>
            <p>
              Unter den Voraussetzungen der DSGVO können Sie Auskunft,
              Berichtigung, Löschung, Einschränkung der Verarbeitung oder
              Datenübertragbarkeit verlangen und einer auf berechtigten
              Interessen beruhenden Verarbeitung widersprechen. Außerdem besteht
              ein Beschwerderecht bei einer zuständigen
              Datenschutzaufsichtsbehörde. Zur Ausübung Ihrer Rechte wenden Sie
              sich an <a href="mailto:nya@snupai.me">nya@snupai.me</a>.
            </p>
          </section>

          <section className={styles.imprintSection}>
            <h2 className={styles.imprintH2}>Änderungen dieser Erklärung</h2>
            <p>
              Wir aktualisieren diese Erklärung, wenn sich die Website, ihre
              Dienstleister oder die rechtlichen Anforderungen ändern. Das oben
              genannte Datum kennzeichnet die aktuelle Fassung.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
