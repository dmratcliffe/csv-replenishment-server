//NOTE: This is terribly optimized. Don't care much, atleast, not right now.
//Theres probably a way to do it with one sort, but math _hard_
export const seperateWomensMensUnisex = (list) => {
    var mens = [];
    var womens = [];
    var unisex = [];

    list.forEach(item => {
        var str_item = JSON.stringify(item);
        if (str_item.includes(" Womens ") || str_item.includes(" W ")) //normal items || shoes / accessories
            womens.push(item)
        else if (str_item.includes(" Mens ") || str_item.includes(" M "))
            mens.push(item)
        else
            unisex.push(item)
    });
    return [...unisex.sort(alphabeticItemSort), ...mens.sort(alphabeticItemSort), ...womens.sort(alphabeticItemSort)];
}

function alphabeticItemSort(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
}