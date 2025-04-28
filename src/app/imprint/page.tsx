"use client";

import React from "react";
import styles from "./imprint.module.css";

export default function ImprintPage() {
  return (
    <main className={styles.imprintMain}>
      {/* Disclaimer: The person and contact details listed below are NOT Miizu, but only the website administrator. To contact Miizu directly, please use the /contact page. */}
      <div style={{border: '2px solid #ff9800', borderRadius: '8px', padding: '1em', background: '#fffbe7', color: '#8a6d1a', marginBottom: '2em', fontWeight: 'bold'}}>
        <p>Disclaimer: The person and contact details below are <u>not</u> Miizu, but only the website administrator. To contact Miizu directly, please use the <a href="/contact">/contact</a> page.</p>
        <p style={{marginTop: '0.5em'}}>Hinweis: Die unten aufgeführte Person und die Kontaktdaten sind <u>nicht</u> Miizu, sondern ausschließlich der Webseiten-Verwalter / Administrator. Miizu selbst kann ausschließlich über die <a href="/contact">/contact</a>-Seite kontaktiert werden.</p>
      </div>
      {/* ENGLISH VERSION */}
      <h1 className={styles.imprintH1}>Imprint</h1>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Information according to § 5 DDG (German Digital Services Act)</h2>
        <address className={styles.imprintAddress}>
          Yann-Luca Näher<br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen<br />
          Germany
        </address>
        <p className={styles.imprintItalic}>Please do not send packages to this address.</p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Represented by</h2>
        <p>Yann-Luca Näher</p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Contact</h2>
        <p>
          <strong>Phone:</strong> <a href="tel:+4915120767544">+49 1512 0767544</a><br />
          <strong>Email:</strong> <a href="mailto:nya@snupai.me">nya@snupai.me</a>
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Responsible for the content according to § 18 Abs. 2 MStV (German State Media Treaty)</h2>
        <address className={styles.imprintAddress}>
          Yann-Luca Näher<br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen
        </address>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>EU Dispute Resolution</h2>
        <p>
          In accordance with the Regulation on Online Dispute Resolution in Consumer Affairs (ODR Regulation), we inform you about the existence of the Online Dispute Resolution Platform (ODR Platform). Consumers have the possibility to submit complaints to the Online Dispute Resolution Platform of the European Commission at{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/consumers/odr/
          </a>.
          The necessary contact details can be found above in our imprint.
        </p>
        <p>
          However, we would like to point out that we are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Liability for Content</h2>
        <p>
          As a service provider, we are responsible for our own content on these pages according to § 7 Abs. 1 DDG under general laws. According to §§ 8 to 10 DDG, however, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
        </p>
        <p>
          Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this regard is only possible from the point in time at which knowledge of a specific infringement of the law is obtained. Upon notification of corresponding violations, we will remove this content immediately.
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Liability for Links</h2>
        <p>
          Our offer contains links to external websites of third parties, over whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking.
        </p>
        <p>
          However, permanent content control of the linked pages is not reasonable without concrete evidence of an infringement. Upon notification of violations, we will remove such links immediately.
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Copyright</h2>
        <p>
          The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
        </p>
        <p>
          Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon notification of violations, we will remove such content immediately.
        </p>
      </section>
      <hr className="my-12" />
      {/* GERMAN VERSION */}
      <h1 className={styles.imprintH1}>Impressum</h1>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Angaben gemäß § 5 DDG</h2>
        <address className={styles.imprintAddress}>
          Yann-Luca Näher<br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen<br />
          Deutschland
        </address>
        <p className={styles.imprintItalic}>Bitte versenden Sie keine Pakete an dieser Adresse.</p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Vertreten durch</h2>
        <p>Yann-Luca Näher</p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Kontakt</h2>
        <p>
          <strong>Telefon:</strong> <a href="tel:+4915120767544">+49 1512 0767544</a><br />
          <strong>E-Mail:</strong> <a href="mailto:nya@snupai.me">nya@snupai.me</a>
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <address className={styles.imprintAddress}>
          Yann-Luca Näher<br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen
        </address>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>EU-Streitschlichtung</h2>
        <p>
          Gemäß der Verordnung über die Online-Streitbeilegung in Verbraucherangelegenheiten (ODR-Verordnung) informieren wir Sie über die Existenz der Online-Streitbeilegungsplattform (OS-Plattform). Verbraucher haben die Möglichkeit, Beschwerden über die OS-Plattform der Europäischen Kommission unter{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/consumers/odr/
          </a> einzureichen. Die dafür erforderlichen Kontaktdaten finden Sie oben in unserem Impressum.
        </p>
        <p>
          Es sei jedoch darauf hingewiesen, dass wir weder bereit noch verpflichtet sind, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungs­stelle teilzunehmen.
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        </p>
        <p>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>
      </section>
      <section className={styles.imprintSection}>
        <h2 className={styles.imprintH2}>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <p>
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
        </p>
      </section>
    </main>
  );
}