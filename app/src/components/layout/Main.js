import { Switch, Route } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import * as monaco from 'monaco-editor'

import { useRef } from 'react'
import { useState, useEffect } from 'react'
import './Main.css'

const Main = () => {
  return (
    <main className="Main">
      <Switch>
        <Route path="/account/editor">
          <IDE />
        </Route>

        <Route path="/account/tokens">
          <p>Tokens goes here ...</p>
        </Route>

        <Route path="/account/drafts">
          <p>Token drafts goes here ...</p>
        </Route>

        <Route path="/collection">
          <p>Collection goes here ...</p>
        </Route>

        <Route path="/">
          <p>
            Determined to make the salon-going public recognize his genius, Lantier spends the rest of his life trying and failing to complete what he believes will be his masterpiece, watching from the sidelines as his former friends and rivals win fame and fortune for watered-down versions of his radical pictorial innovations. In the end, broken and destitute, he hangs himself in his studio next to the painting, which isn’t a masterpiece at all but an incoherent mess. Zola had once championed the Impressionists, but this novel seemed to suggest they had failed to live up to their potential. It was scathing enough to end his friendship with Cézanne. After the book’s publication, they never spoke again.

            Fictional portrayals of the art world today are rarely more flattering, but new stock tropes have replaced salon-going philistines foolishly jeering at the avant-garde and pompous painters assured of their superiority. The contemporary art world is, more often than not, represented as a ridiculous shell game in which empty provocation is propped up by canny marketing and rampant financial speculation. Collectors are rich idiots looking to be flattered, gallerists are shrewd capitalists who cloak luxury retail operations in the pretense of a higher calling, curators are overeducated airheads in Prada who have memorized the Frankfurt School Cliff’s Notes, successful artists are talentless fakers who look the part, or naive and corruptible dupes. Critics, of course, are bloviating hacks, not to mention, the dumbest ones of all, since they don’t even stand to profit from their participation in this charade. Even novels that depict meaningful encounters with contemporary artworks tend to regard the art world itself skeptically, as if the work succeeds in spite of the best efforts of professionals who smother it with slick pretentiousness: in both Ben Lerner’s 10:04 (2014), parts of which are set at a residency in Marfa, and Enrique Vila-Matas’s picaresque The Illogic of Kassel (2014), a fictionalized account of the author’s participation as a “writer in residence” at Documenta 13, the protagonists liken themselves to visitors to an alien planet inhabited by strange, unintelligible creatures.

            The Unsatisfying Pessimism of Art World
            The Blazing World by Siri Hustvedt, Simon & Schuster, 2014; 384 pages
            All the familiar grotesques appear in Siri Hustvedt’s 2014 novel, The Blazing World, presented as an anthology reconstructing the murky details of Harriet Burden’s project “Maskings” (1998–2003), a hoax for which the sixty-something Burden, bristling at decades of art world neglect, enlisted three young male artists to exhibit her works as their own. Through annotated excerpts from Burden’s diaries, archival press clippings, and interviews with family, friends, and participants in her scheme, witting and unwitting, we learn that Burden had a minor career as an artist in the 1970s and ’80s, but is better known as the lumbering and unpleasant wife of the esteemed art dealer Felix Lord. Her work, to the extent that anyone notices it, is dismissed as “high-flown, sentimental, and embarrassing.” When Felix dies, the art world—“that incestuous, moneyed, whirring globule composed of persons who buy and sell aesthetic objets”—has no use for her at all, and she retreats with his money to the distant wilds of Brooklyn to plot her revenge. Attached to more appealing authorial personas—a photogenic recent SVA grad named Anton Tish, the gay Black performance artist Phineas Q. Eldridge, and the mononymic Rune, a blue-chip bad boy who thinks it all sounds like a lark—Burden’s work, she believes, will finally get the recognition it deserves, at which point she will appear from behind the curtain, not only presenting the art world with devastating evidence of its own sexist bias, but proving that she has been smarter and better than the “twits, dunderheads, and fools” all along.

            Naturally, things do not go according to plan. Though Anton’s and Rune’s shows are rapturously received—Phineas’s is, tellingly, a more modest success, garnering a few short, positive reviews, but none of the fanfare lavished on his straight white counterparts—Burden’s attempts to take credit are met with derision and disbelief. Anton disappears and Rune denies everything, claiming that “Harriet Lord” is merely a delusional patron. (Phineas is the only one of the “masks” to openly confirm Burden’s account, but also the one whose word matters least.) The various critics, collectors, and gallerists who have embraced the work, each more slippery and odious than the next, find it far easier to believe that she is a mad, jealous harpy than an unheralded artistic genius. “I am as tickled by a good hoax as the next person,” says the critic Oswald Case, “but a fiftyish woman who’s been hanging around the art world all her life can’t really be called a prodigy can she?” In the end, Rune gets the last word, dying spectacularly in a Houdini-esque performance gone wrong, with Burden’s installation Beneath hailed as the crowning achievement of his already distinguished career. No such glowing tributes are forthcoming when Burden herself dies from cancer not long after; only years later does her work enter the cycle of posthumous rediscovery that has elevated so many women artists of her generation.

            Cover of Michel Houellebecq's novel The Map and the Territory
            The Map and the Territory by Michel Houellebecq, Penguin Random House, 2012; 288 pages.
            While Hustvedt’s Harriet Burden is the raging embodiment of thwarted ambition, Jed Martin, the dispassionate artist protagonist of Michel Houellebecq’s The Map and the Territory (originally published in French in 2010), effortlessly rises to the top. The two novels’ supporting players, however, are quite similar. The Map and the Territory, for which Houellebecq won the Prix Goncourt, opens as Martin wrestles with an allegorical portrait titled Damien Hirst and Jeff Koons Dividing Up the Art Market. It isn’t conceived as a critique so much as an even-handed assessment of the field: “On the ArtPrice ranking of the richest artists, Koons was number 2,” recently overtaken by Hirst, Martin notes. He himself is at the bottom of the list, but not for long: later that year, he sells out a show of paintings similarly depicting tête-à-têtes among titans of various industries, netting him a staggering 15 million euros ($19.9 million), even after his gallerist’s 50 percent cut; in a metafictional twist, the catalogue essay is written by none other than the famous writer Michel Houellebecq, who, in the book’s final section, is gruesomely murdered by an art thief seeking the portrait he received as compensation, now valued in the low eight figures. Though the novel is set roughly in the aughts, it purports to be written from the vantage of the mid-twenty-first century, when Martin is a decidedly canonical artist, and his ascent is narrated with a biographer’s hindsight, peppered with references to art historical monographs by specialists like Wong Fu Xin. (In the future, cultural hegemony belongs to China.)

            Martin’s initial artistic breakthrough comes when he has a profound aesthetic encounter with a roadmap en route to his grandmother’s funeral in the French countryside. Houellebecq narrates the incident in perfect deadpan: “Never had he contemplated an object as magnificent, as rich in emotion and meaning, as this 1/150,000-scale Michelin map of the Creuse and the Haute-Vienne.” He begins producing exquisite, large-scale photographs of Michelin maps, to the great delight of the Michelin Group, whose publicist, a Slavic goddess named Olga, recognizes that the universe has dropped a gift into her lap. A solo exhibition is organized at the company’s headquarters, to ecstatic reviews; one especially orotund example, ascribed to the real-world Le Monde art critic Patrick Kéchichian, describes Martin as “adopt[ing] the point of view of a God coparticipating, alongside man, in the (re)construction of the world,” comparing the artist’s “rational theology” to that of Thomas Aquinas. One day, the Michelin series is simply done, and Martin moves on, practically on a whim, to the paintings that cement his reputation as a twenty-first-century master: portraits representing a cross-section of contemporary professions, from horse butcher to tech CEO. The critic Kéchichian believes the series represents “God descended among men . . . to pay homage, with his full presence, to the sacerdotal dignity of human labor”; the art historians of the future call it “a relational and dialectical image of the functioning of the economy of the whole”; the artist says it’s simply “an account of the world.”
          </p>
        </Route>
      </Switch>
    </main>
  )
}

function IDE() {
  return (
    <div className="IDE">
      <div className="workspace">
        <Tabs defaultIndex={2}>
          <TabList>
            <Tab>index.html</Tab>
            <Tab>style.css</Tab>
            <Tab>main.js</Tab>
            {/* <Tab>+</Tab> */}
          </TabList>

          <TabPanel>
            <Editor
              id="editorHTML"
              language="html"
              source={'<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js"></script>\n\t\t<link rel="stylesheet" type="text/css" href="style.css">\n\t\t<meta charset="utf-8" />\n\t</head>\n\t<body>\n\t\t<script src="sketch.js"></script>\n\t</body>\n</html>'}
            />
          </TabPanel>

          <TabPanel>
            <Editor
              id="editorCSS"
              language="css"
              source={"html, body {\n\tmargin: 0;\n\tpadding: 0;\n}\ncanvas {\n\tdisplay: block;\n}"}
            />
          </TabPanel>

          <TabPanel>
            <Editor
              id="editorJS"
              language="javascript"
              source={"function setup() {\n\tcreateCanvas(400, 400);\n}\n\nfunction draw() {\n\tbackground(220);\n}"}
            />
          </TabPanel>
        </Tabs>
      </div>
      <div className="preview">
        <iframe src="http://localhost:4000/" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

function Editor({ id, language, source }) {
  const editorRef = useRef()
  const [editor, setEditor] = useState(null)


  //TODO: refactor editor init
  useEffect(() => {
    if (!editor) {
      setEditor(
        monaco.editor.create(editorRef.current, {
          theme: 'vs-dark',
          scrollBeyondLastLine: false,

          language: language,
          value: source,

          minimap: { enabled: false },
          rulers: [60, 120],
        })
      )
    }
  }, [])

  return (
    <div ref={editorRef} id={id} className="EditorInstance" />
  )
}

export default Main