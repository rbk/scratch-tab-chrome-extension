// json view
class JsonViewer {
  constructor() {
    this.storageKey = "jsonviewer"
    this.temp = ""
    this.paste = "Metav"
    this.btn = document.querySelector(".btn-json")
    this.page = document.querySelector("#json")
    this.setup()
    this.addEvents()
  }
  setup(){
    let ls = localStorage.getItem(this.storageKey)
    if(ls) {
      
    }
  }
  addEvents(){
    this.btn.addEventListener('click', () => {
      this.btn.classList.toggle('active')
      this.page.classList.toggle('hide')
    })
    this.page.addEventListener('keydown', (e) => {
      if (e.code == "KeyV") {
        this.temp = "KeyV"
      }
    })
    this.page.addEventListener('keyup', (e) => {
      if (this.temp == "KeyV") {
        this.temp = ""
        this.page.value = JSON.stringify(JSON.parse(this.page.value), null, 4)
      }
    });
  }
}
const jv = new JsonViewer()
