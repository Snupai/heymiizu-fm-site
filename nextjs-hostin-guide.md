# So geht Ihre neue Website online – Die vollständige Anleitung für absolute Anfänger

## Keine Sorge – Das ist wirklich einfacher, als es klingt!

Herzlichen Glückwunsch! Ihre Website ist fertig und bereit, von der Welt gesehen zu werden. Wir haben sie mit modernen, professionellen Werkzeugen erstellt, die Ihre Website schnell, sicher und zuverlässig machen.

Diese Anleitung führt Sie Schritt für Schritt durch den gesamten Prozess. **Sie benötigen keinerlei technisches Vorwissen.** Denken Sie einfach, Sie folgen einem Kochrezept. In etwa 15-20 Minuten wird Ihre Website im Internet live sein.

## Was sind eigentlich GitHub und Vercel? Und warum benutzen wir sie?

Stellen Sie sich vor, Sie bauen ein Haus. Sie benötigen zwei Dinge: einen detaillierten Bauplan und ein Grundstück mit einem Bauunternehmen, das das Haus baut und für Besucher öffnet.

In unserer digitalen Welt ist das ganz ähnlich:

* **GitHub** = **Der Tresor für Ihren Bauplan.**
    * GitHub ist ein extrem sicherer Ort im Internet, an dem alle Dateien und der gesamte Code Ihrer Website gespeichert sind. Es ist wie ein Google Drive oder eine Dropbox, aber speziell für Website-Projekte entwickelt.
    * **Der Clou:** GitHub merkt sich jede einzelne Änderung, die jemals gemacht wurde. Wenn also etwas schiefgeht, können wir jederzeit zu einer älteren, funktionierenden Version zurückkehren. Es ist das ultimative Sicherheitsnetz.

* **Vercel** = **Das Baugrundstück und das blitzschnelle Bauunternehmen.**
    * Vercel ist der Dienst, der den Bauplan von GitHub nimmt, Ihre Website daraus "baut" und sie der ganzen Welt zugänglich macht. Es ist also viel mehr als nur eine Hosting-Firma; es ist ein automatisierter Prozess.
    * **Der Clou:** Sobald wir den Bauplan (auf GitHub) aktualisieren, merkt Vercel das sofort, baut die Website automatisch neu und stellt die neue Version online – meist in unter drei Minuten.

**Kurz gesagt:** GitHub bewahrt die "Wahrheit" Ihrer Website auf, und Vercel zeigt sie der Welt. Diese beiden Dienste arbeiten perfekt zusammen und werden von den größten Unternehmen der Welt wie Netflix, TikTok, Adobe und McDonald's verwendet. Sie erhalten also eine absolut professionelle Lösung – und das Beste daran ist, für die meisten Unternehmenswebsites ist sie komplett kostenlos.

---

## Teil 1: Ihren GitHub-Zugang aktivieren (Der Tresor für den Bauplan)

### Schritt 1: Suchen Sie die Einladungs-E-Mail von GitHub

1.  **Öffnen Sie Ihr E-Mail-Programm.** Suchen Sie nach einer E-Mail mit dem Absender "GitHub". Schauen Sie unbedingt auch in Ihrem Spam- oder Junk-Ordner nach.
2.  Der Betreff der E-Mail wird so oder so ähnlich lauten: **"[Entwickler-Name] has invited you to collaborate on [ihr-website-name]"**.
3.  In dieser E-Mail befindet sich ein großer, grüner Knopf. Klicken Sie darauf: **"Accept invitation"** (Einladung annehmen). Damit bestätigen Sie, dass Sie der Eigentümer des Bauplans sind.

### Schritt 2: Ihr kostenloses GitHub-Konto erstellen (falls noch nicht vorhanden)

Wenn Sie noch nie ein GitHub-Konto hatten, werden Sie nach dem Klick auf den Knopf aufgefordert, eines zu erstellen.

1.  **Besuchen Sie die Seite** [github.com](https://github.com).
2.  Klicken Sie auf den grünen **"Sign up"**-Knopf (normalerweise oben rechts).
3.  **Geben Sie Ihre E-Mail-Adresse ein.** Wichtig: Verwenden Sie exakt dieselbe E-Mail-Adresse, an die auch die Einladung gesendet wurde. Nur so kann GitHub Sie zuordnen.
4.  **Erstellen Sie ein sicheres Passwort.** Schreiben Sie es sich an einem sicheren Ort auf.
5.  **Wählen Sie einen Benutzernamen.** Das kann Ihr Name, Ihr Firmenname oder etwas anderes sein. Er ist nicht auf der Website sichtbar.
6.  Folgen Sie den weiteren Schritten zur Kontoerstellung. Möglicherweise müssen Sie ein kleines Rätsel lösen, um zu beweisen, dass Sie ein Mensch sind.
7.  **Bestätigen Sie Ihre E-Mail-Adresse.** GitHub sendet Ihnen eine weitere E-Mail mit einem Bestätigungslink. Öffnen Sie diese und klicken Sie auf den Link.

### Schritt 3: Zugang zu Ihren Website-Dateien erhalten

1.  Nachdem Sie die Einladung angenommen und sich eingeloggt haben, landen Sie auf einer neuen Seite. Sie sehen eine Liste von Dateien und Ordnern.
2.  **Das ist das "Repository" Ihrer Website.** Das ist nur ein schickes Wort für den Projektordner, der alle Ihre Website-Dateien – Ihren kompletten Bauplan – enthält.
3.  **Setzen Sie sofort ein Lesezeichen für diese Seite in Ihrem Browser!** Dies ist Ihre zentrale Anlaufstelle. Hierher kommen Sie später zurück, falls Sie kleine Textänderungen selbst vornehmen möchten.
4.  **Keine Panik beim Anblick der Dateien!** Sie müssen nicht verstehen, was `index.html`, `package.json` oder andere Dateien bedeuten. Ihr Entwickler hat alles perfekt für Sie eingerichtet. Betrachten Sie es einfach als den Motorraum Ihres Autos – Sie müssen nicht wissen, wie er funktioniert, nur wo er ist.

---

## Teil 2: Vercel einrichten (Das Bauunternehmen, das Ihre Website live schaltet)

Jetzt, wo wir den Bauplan haben, beauftragen wir das Bauunternehmen, die Website für alle sichtbar zu machen.

### Schritt 1: Ihr kostenloses Vercel-Konto erstellen

1.  **Öffnen Sie einen neuen Tab** in Ihrem Browser und gehen Sie zu [vercel.com](https://vercel.com).
2.  Klicken Sie auf **"Sign Up"** (Anmelden) oben rechts.
3.  Sie sehen mehrere Optionen. Wählen Sie die Wichtigste aus: **"Continue with GitHub"**. Dadurch geben Sie dem Bauunternehmen (Vercel) einen Schlüssel zum Tresor (GitHub), damit es auf den Bauplan zugreifen kann.
4.  Ein Fenster von GitHub wird sich öffnen und fragen, ob Sie Vercel den Zugriff erlauben möchten. Klicken Sie auf den grünen Knopf **"Authorize Vercel"** (Vercel autorisieren).
5.  Das war's schon! Sie sind jetzt bei Vercel angemeldet und die beiden Dienste sind miteinander verbunden.

### Schritt 2: Ihre Website importieren und live schalten

1.  Vercel wird Ihr GitHub-Konto automatisch nach Website-Projekten durchsuchen. Sie sollten eine Liste sehen.
2.  Suchen Sie den Namen Ihrer Website in der Liste (er ist identisch mit dem Namen auf GitHub). Klicken Sie auf den **"Import"**-Knopf daneben.
3.  Sie landen auf einer Konfigurationsseite. **Ändern Sie hier absolut nichts.** Alle Einstellungen sind bereits korrekt im Code hinterlegt.
4.  Scrollen Sie einfach nach unten und klicken Sie auf den großen **"Deploy"**-Knopf (Bereitstellen).
5.  **Jetzt passiert die Magie!** ✨ Vercel holt sich eine Kopie Ihres Bauplans von GitHub, baut daraus Ihre Website und stellt sie auf seinem weltweiten Netzwerk bereit. Dieser Prozess dauert in der Regel 2-3 Minuten. Sie können den Fortschritt live auf dem Bildschirm verfolgen.

### Schritt 3: Ihre Website ist online!

1.  Sobald der Prozess abgeschlossen ist, sehen Sie eine große Erfolgsmeldung, oft mit Konfetti: **"Congratulations! Your project has been deployed."**
2.  Klicken Sie auf das Vorschaubild Ihrer Website oder den **"Visit"**-Knopf.
3.  Ein neuer Tab öffnet sich und voilà – Sie sehen Ihre fertige Website live im Internet!
4.  **Kopieren Sie die Adresse (URL)** aus der Adresszeile Ihres Browsers. Sie wird ungefähr so aussehen: `ihr-website-name.vercel.app`.
5.  **Diesen Link können Sie jetzt mit jedem teilen!** Ihre Website ist offiziell online.

---

## Teil 3: Ihre eigene Domain verbinden (z.B. `www.meine-firma.de`)

Die `vercel.app`-Adresse ist eine super Vorschau, aber für ein professionelles Auftreten möchten Sie natürlich Ihre eigene Domain verwenden.

### Fall A: Sie besitzen bereits eine Domain

1.  Gehen Sie zurück zu Ihrem Vercel-Dashboard und klicken Sie auf Ihr Projekt.
2.  Klicken Sie im oberen Menü auf **"Settings"** (Einstellungen) und dann in der linken Seitenleiste auf **"Domains"**.
3.  Geben Sie Ihre Domain (z.B. `www.meine-firma.de`) in das Feld ein und klicken Sie auf **"Add"** (Hinzufügen).
4.  **Jetzt kommt der einzige etwas knifflige Teil:** Vercel zeigt Ihnen nun ein oder zwei "Einträge" (meist "A-Record" oder "CNAME"), die Sie bei Ihrem Domain-Anbieter (wie Strato, 1&1, IONOS, GoDaddy etc.) eintragen müssen.
    * **Was bedeutet das?** Sie müssen Ihrem Domain-Anbieter mitteilen, wo im Internet Ihre neue Website "wohnt". Vercel gibt Ihnen die genaue Adresse, und Sie müssen diese in die Verwaltungsoberfläche Ihrer Domain eintragen.
5.  Loggen Sie sich bei Ihrem Domain-Anbieter ein, finden Sie die "DNS-Einstellungen" und kopieren Sie die Werte von Vercel dorthin.
6.  **Wenn Sie sich unsicher sind:** Machen Sie einen Screenshot von den Anweisungen bei Vercel und kontaktieren Sie den Kundenservice Ihres Domain-Anbieters. Sagen Sie: "Hallo, ich möchte meine Domain mit Vercel verbinden. Können Sie mir bitte helfen, diese DNS-Einträge zu setzen?" Die wissen genau, was zu tun ist.

### Fall B: Sie müssen noch eine Domain kaufen

1.  Beliebte und seriöse Anbieter für den Kauf von Domains sind z.B. Strato, IONOS by 1&1 oder Namecheap.
2.  Suchen Sie dort nach Ihrem Wunschnamen. Wenn er frei ist, kaufen und registrieren Sie ihn.
3.  Sobald die Domain Ihnen gehört, folgen Sie den Schritten aus "Fall A", um sie mit Vercel zu verbinden.

---

## Teil 4: Wie Updates funktionieren (Der wirklich magische Teil)

Das Beste an diesem System ist, wie einfach Änderungen sind.

**Jedes Mal, wenn Ihr Entwickler (oder Sie) eine Änderung am Bauplan auf GitHub speichert, merkt Vercel dies innerhalb von Sekunden und baut Ihre Website automatisch neu. Sie müssen absolut nichts tun.**

### Kleine Textänderungen selbst vornehmen (optional)

Für Mutige: So können Sie einen Tippfehler selbst korrigieren.

1.  **Gehen Sie zu Ihrem GitHub Repository** (die Seite, die Sie sich als Lesezeichen gespeichert haben).
2.  Navigieren Sie zu der Datei, die den zu ändernden Text enthält. (Ihr Entwickler kann Ihnen sagen, wo die wichtigsten Texte liegen, z.B. in einer Datei namens `index.html` oder `home.md`).
3.  Klicken Sie auf den Dateinamen und dann auf das kleine **Stift-Symbol (✏️)** oben rechts, um die Datei zu bearbeiten.
4.  Machen Sie Ihre Textänderung direkt im Browser.
5.  Scrollen Sie ganz nach unten. Dort sehen Sie ein Feld, in das Sie eine kurze Notiz schreiben können, was Sie geändert haben (z.B. "Tippfehler im Slogan korrigiert").
6.  Klicken Sie auf den grünen **"Commit changes"**-Knopf. "Commit" bedeutet so viel wie "Änderung final speichern".
7.  **Das war's!** Lehnen Sie sich zurück. Vercel hat die Änderung bereits bemerkt und aktualisiert Ihre Website. Nach 2-3 Minuten ist die Änderung live sichtbar!

### Für alle größeren Änderungen:

Kontaktieren Sie einfach Ihren Entwickler. Er ist für alles zuständig, was über eine kleine Textkorrektur hinausgeht, wie z.B.:
* Design-Anpassungen
* Neue Seiten oder Abschnitte
* Neue Funktionen (z.B. ein Kontaktformular)

---

## Teil 5: Ihre Website im Blick behalten

Sie können jederzeit den Zustand Ihrer Website überprüfen.

1.  Loggen Sie sich bei [vercel.com](https://vercel.com) ein.
2.  Klicken Sie auf Ihr Projekt.
3.  **Sie sehen Ihr Dashboard.** Hier finden Sie eine Übersicht über die letzten Updates ("Deployments") und oft auch einfache Statistiken, wie viele Leute Ihre Seite besuchen.

**Die Status-Ampel:**
* **Grün:** Alles bestens, Ihre Website läuft perfekt.
* **Gelb/Orange:** Ein neues Update wird gerade gebaut. Warten Sie einfach ein paar Minuten, bis es grün wird.
* **Rot:** Hoppla, beim letzten Update ist ein Fehler aufgetreten. Keine Panik! Ihre live-Website zeigt weiterhin die letzte funktionierende Version an. Machen Sie einen Screenshot und schicken Sie ihn Ihrem Entwickler.

---

## Teil 6: Was tun, wenn etwas schiefgeht?

### Die Website lädt nicht mehr.

1.  **Erster Test:** Versuchen Sie, die Seite in einem anderen Browser oder auf Ihrem Smartphone zu öffnen. Manchmal liegt das Problem nur am eigenen Computer-Cache.
2.  **Zweiter Check:** Loggen Sie sich bei [vercel.com](https://vercel.com) ein. Ist der Status Ihres Projekts grün?
3.  **Hilfe holen:** Wenn alles rot ist oder die Seite nach 10 Minuten immer noch nicht erreichbar ist, kontaktieren Sie Ihren Entwickler mit einem Screenshot.

### Probleme beim Einloggen?

1.  Sowohl GitHub als auch Vercel haben auf ihren Login-Seiten einen **"Forgot password?"** (Passwort vergessen?) Link. Nutzen Sie diesen, um Ihr Passwort zurückzusetzen.
2.  **Tipp:** Speichern Sie Ihre Passwörter in einem Passwort-Manager.

### "Ich habe beim Bearbeiten etwas kaputt gemacht!"

**Entspannen Sie sich. Das ist fast unmöglich.** Dank GitHub wird jede einzelne Version Ihrer Website gespeichert. Es ist für Ihren Entwickler ein Leichtes, mit nur wenigen Klicks zu einer früheren, funktionierenden Version zurückzukehren. Es kann nichts dauerhaft verloren gehen.

---

## Teil 7: Was kostet der Spaß?

### Die fantastische Nachricht:

**Für 99% aller Unternehmenswebsites ist dieses professionelle Setup komplett KOSTENLOS.** Der "Hobby"-Tarif von Vercel ist extrem großzügig und beinhaltet:

* **GitHub:** Unbegrenzter Speicherplatz für Ihre Website-Dateien.
* **Vercel:** 100GB Datenverkehr (Bandbreite) pro Monat. Das reicht locker für Zehntausende Besucher.
* **Automatisches SSL-Zertifikat:** Das kleine Schloss-Symbol (🔒) im Browser, das die Verbindung sicher macht. Normalerweise kostet das extra, hier ist es inklusive.
* **Globales CDN:** Ihre Website wird auf Servern auf der ganzen Welt verteilt und lädt für Besucher aus den USA genauso schnell wie für Besucher aus Deutschland.

Sie müssten erst über ein Upgrade auf einen kostenpflichtigen Plan (ca. 20€/Monat) nachdenken, wenn Ihre Website extrem erfolgreich wird und konstant sehr hohen Traffic hat (z.B. ein großer Online-Shop oder ein viraler Blog).

---

## Teil 8: Sicherheit und Backups

Ihre Website ist mit diesem System sicherer als mit den meisten traditionellen Hosting-Paketen.

* **Versionierung:** GitHub speichert jede Änderung als Backup. Ihre Website-Daten können nie verloren gehen.
* **Zuverlässigkeit:** Vercel hat eine garantierte Verfügbarkeit von 99,99%.
* **Sicherheit:** Da es kein klassisches System wie WordPress mit Plugins gibt, die veralten können, gibt es deutlich weniger Angriffsvektoren für Hacker. Alles ist immer auf dem neuesten Stand.
* **SSL:** Die Verbindung ist immer verschlüsselt, was Vertrauen bei Ihren Besuchern schafft und für Google wichtig ist.

**Ihre einzige Aufgabe:**
1.  Verwenden Sie **starke, einzigartige Passwörter** für Ihre GitHub- und Vercel-Konten.
2.  Aktivieren Sie die **Zwei-Faktor-Authentifizierung (2FA)** in den Sicherheitseinstellungen beider Dienste. Das bedeutet, dass Sie zum Einloggen zusätzlich zu Ihrem Passwort einen Code von Ihrem Handy benötigen. Das ist der Goldstandard für Sicherheit.

---

## Teil 9: Wann und wie Sie Hilfe anfordern

### Schnelle Lösungen, die Sie selbst probieren können:

1.  **Browser-Cache leeren:** Manchmal zeigt Ihr Browser eine alte Version der Seite an. Googeln Sie "Cache leeren [Ihr Browser-Name]", um eine Anleitung zu finden.
2.  **Anderen Browser/Gerät testen:** So stellen Sie sicher, dass das Problem nicht nur bei Ihnen lokal auftritt.

### Wann Sie Ihren Entwickler kontaktieren sollten:

* Wenn Sie im Vercel-Dashboard einen **roten Fehlerstatus** sehen.
* Wenn Ihre Website **länger als 10 Minuten offline** ist.
* Wenn Sie **inhaltliche oder gestalterische Änderungen** benötigen, die über eine kleine Textkorrektur hinausgehen.
* Immer, wenn Sie sich **unsicher sind oder ein schlechtes Gefühl haben.** Lieber einmal zu viel fragen als zu wenig!

**Welche Informationen helfen Ihrem Entwickler?**
* Ein **Screenshot** der Fehlermeldung.
* Eine kurze Beschreibung, **was Sie getan haben**, bevor der Fehler auftrat.
* Die **URL Ihrer Website**.
* Den **Namen und die Version Ihres Browsers** (z.B. Chrome, Firefox, Safari).

---

## Zusammenfassung: Sie haben das im Griff! 🎉

**Schauen Sie, was Sie gerade geschafft haben:**
* ✅ Ihre Website ist professionell gehostet und weltweit live.
* ✅ Sie verfügt über einen automatisierten Update-Prozess.
* ✅ Sie ist blitzschnell, extrem sicher und zuverlässig.
* ✅ Die laufenden Kosten sind bei normaler Nutzung gleich null.
* ✅ Sie wissen, wie Sie den Status Ihrer Website überprüfen können.
* ✅ Sie wissen genau, wann und wie Sie um Hilfe bitten müssen.

Sie nutzen jetzt die exakt gleiche Technologie, auf die sich einige der größten Tech-Firmen der Welt verlassen. Das ist ein Grund, stolz zu sein!

Und denken Sie immer daran: Diese Anleitung deckt 99% aller Fälle ab. Für das restliche 1% ist Ihr Entwickler nur eine kurze Nachricht entfernt. Zögern Sie niemals, sich zu melden.

**Herzlich willkommen im Internet! Ihre Website ist nun bereit für die Welt. 🌐**