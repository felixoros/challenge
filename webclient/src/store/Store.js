import {autorun, observable} from "mobx";

class Store {
    @observable canBeLoaded = false;
}

const store = window.store = new Store();

export default store;

autorun(() => {
    console.log(store.canBeLoaded);
})