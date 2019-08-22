function getString(attribute){
            let reg = new RegExp(`(^|&)${attribute}=([^&]*)(&|$)`);
        　　let r = window.location.search.substr(1).match(reg);
            if(r != null) return decodeURIComponent(r[2]);
}

export default getString