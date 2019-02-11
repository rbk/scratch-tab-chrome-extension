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
    this.chromeSync()
  }
  setup(){
    chrome.storage.local.get([this.storageKey], (result) => {
      if (result.jsonviewer) {
        this.page.value = JSON.stringify(JSON.parse(result.jsonviewer), null, 4)
      }
    });
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
        console.log("Test")
        this.temp = ""
        this.page.value = JSON.stringify(JSON.parse(this.page.value), null, 4)
        let obj = {}
        obj[this.storageKey] = this.page.value
        chrome.storage.local.set(obj, function(res) {});
      }
    });
  }
  chromeSync(){
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if(changes[this.storageKey] &&  this.page.value != changes[this.storageKey].newValue) {
        this.page.value = changes[this.storageKey].newValue;
      }
    });
  }
}
const jv = new JsonViewer()
