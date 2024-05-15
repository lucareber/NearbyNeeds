# NearbyNeeds

<p align="center">
  <img src="/doc/app_presentation.png" alt="AppFunktionen" style="height: auto; width:100%;"/>
  <br>
  <em>Abb. 1: Präsentation der Hauptfunktionen der Applikation.</em>
</p>

## 1 Einleitung 
In einer Welt, in der Zeit und Effizienz entscheidend sind, ist es wichtig, das Einkaufsverhalten zu optimieren. Auf dem täglichen Weg zur Arbeit kommen wir an vielen Einkaufsmöglichkeiten vorbei, aber nicht immer sind unsere Gedanken beim Einkaufen. Eine Benachrichtigung im richtigen Moment würde uns helfen, die sich bietende Gelegenheit zu nutzen und die benötigten Produkte zu kaufen. Die Idee zu NearbyNeeds entstand aus der Erkenntnis, dass viele von uns bereits mobile Geräte nutzen, um unsere Einkaufslisten zu verwalten, aber nur wenige Listen über einen standortbezogenen Zugang verfügen, der automatisch Benachrichtigungen versendet. 

Die App funktioniert über die einfache Eingabe von Geschäften und Produkten in eine übersichtliche Liste. Sobald sich der Nutzer einem Geschäft nähert, in dem Produkte aus der Liste gekauft werden müssen, erhält er eine Benachrichtigung. Diese intelligente Benachrichtigungsfunktion macht den Einkaufsprozess effizienter und stressfreier, da sie sicherstellt, dass nie wieder ein Artikel auf der Liste vergessen wird.

## 2 Technische Umsetzung
Die Applikation nutzt das JavaScript-Framework [Angular](https://angular.io/) und das Open-Source-Webframework [Ionic](https://ionicframework.com/). Ergänzend dazu wird die Laufzeitumgebung [capacitor](https://capacitorjs.com/) für die Erstellung von plattform übergreifenden Web Apps (mit Javascript, HTML und CSS) genutzt. Innerhalb des capacitor's werden vorwiegend die Plugins [background-runner](https://capacitorjs.com/docs/apis/background-runner), für Funktionen im Hintergrund und während die App geschlossen ist, und [geolocation](https://capacitorjs.com/docs/apis/geolocation), für das Abrufen der Geräteposition, eingesetzt. Die Kartendarstellung wird mit der JavaScript-Bibliothek [Leaflet](https://leafletjs.com/) realisiert.

## 3 Resultat
Die Anwendung ist in drei Ansichten unterteilt und ermöglicht so eine einfache Verwaltung der Einkaufslisten pro Geschäft. Neben den Ansichten erweist sich die automatische Benachrichtigung, sobald sich das Gerät in der Nähe (500 m) eines Geschäftes befindet, in dem Produkte eingekauft werden müssen, als besonders nützlich. Indem sichergestellt wird, dass die Benachrichtigung nur dann ausgelöst wird, wenn auch Produkte gekauft werden müssen, werden unnötige Benachrichtigungen vermieden. 

<p align="center">
  <img src="/doc/app_notification.png" alt="AppBenachrichtigung" style="height: auto; width:100%;"/>
  <br>
  <em>Abb. 2: Erscheinungsbild einer Benachrichtigung bei Geschäft in der Nähe.</em>
</p>

### 3.1 View: Karte
Der Kartenansicht können die Standorte der Geschäfte entnommen werden. Die übersichtliche Hintergrundkarte der [swisstopo](https://www.swisstopo.admin.ch/de) bietet zudem eine einfache Navigationshilfe. Mit einem einzigen Klick kann die Geräteposition abgerufen werden und ergänzend auf der Karte platziert werden (inklusive Zoom).    

### 3.2 View: Produkte
Zugeordnet zu dem jeweiligen Einkaufsladen werden hier alle Produkte aufgelistet. Dank der Suchfunktion können Geschäfte schnell gefunden werden und so die Einkäufe erledigt werden. Liegt das Produkt im Einkaufswagen, kann es mit nur einem Klick von der Einkaufsliste gelöscht werden. Die Erfassung neuer Produkte ist intuitiv und beschränkt sich auf das Nötigste. 

### 3.3 View: Einkaufsläden
Dieses View dient der Auflistung aller Einkaufsläden. Ein direkter Link zu Google Maps ermöglicht eine schnelle Navigation, sollte der Weg doch etwas schwieriger zu finden sein. Dank der Bemerkung können wichtige Eigenschaften der Geschäfte gespeichert werden. Wie auch beim Erfassen der Produkte werden die Eingaben geprüft und mangelhafte Eingaben entsprechend gemeldet. Die Meldungen unterstützen die Anwendenden in der Korrektur der Eingaben.

<p align="center">
  <img src="/doc/app_error.png" alt="AppFehlermeldung" style="height: auto; width:100%;"/>
  <br>
  <em>Abb. 3: Fehlermeldung bei mangelhafter oder unvollständiger Eingabe (je nach Fehler unterschiedlich).</em>
</p>

## 4 Fazit
Die entwickelte App übernimmt das Denken an das Einkaufen. Werden die Einkaufslisten zuverlässig geführt, geht kein Produkt mehr vergessen. Dank der Benachrichtigung können die Einkäufe immer dann erledigt werden, wenn das Geschäft bereits sehr nahe ist. Dies fördert einerseits die Nachhaltigkeit, optimiert aber auch den Terminplan der Nutzenden. So weit so gut, doch leider können Hintergrundprozesse auf Android nur in einem Intervall von 15 Minuten ausgeführt werden ([background-runner](https://capacitorjs.com/docs/apis/background-runner)). Somit kann nicht sichergestellt werden, dass jede Annäherung an ein Geschäft erkannt wird. Leider konnte in der zur Verfügung stehenden Zeit keine Alternative gefunden werden. Bis auf diese Einschränkung funktionieren die vorgesehenen Funktionen zuverlässig.

## 5 Ausblick
Mögliche Weiterentwicklungen könnten die Berücksichtigung von Öffnungszeiten der Geschäfte, automatisches Laden von Einkaufsmöglichkeiten aus [OpenStreetMap](https://www.openstreetmap.org/) oder das synchronisieren von Einkaufslisten auf mehreren Geräten sein. Inbesondere der letzte Vorschlag dürfte von grossem Interesse sein, wenn ein Haushalt aus mehreren Personen besteht. 

## 5 Inspirationsquellen

- Grimm. Simon. (4. Oktober 2023). How to Create Background Tasks in Ionic with Capacitor. ionic. https://ionic.io/blog/create-background-tasks-in-ionic-with-capacitor. (abgerufen: 14.05.2024).
- Kompf. Martin. (o. D.). Distance calculation. https://en.kompf.de/gps/distcalc.html. (abgerufen: 14.05.2024).



Entstanden im Rahmen einer Projektarbeit im Modul GEO_MobilGI des Studiengangs Master of Science in Engineering.
