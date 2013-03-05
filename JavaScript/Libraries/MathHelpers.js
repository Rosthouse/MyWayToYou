/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function CompareDistances(x1, y1, x2, y2){
    var d1 = CalculateVectorDistance(x1, y1);
    var d2 = CalculateVectorDistance(x2, y2);
    
    return (d1 > d2) ? true : false;
}

function CalculateVectorDistance(x, y){
    return Math.sqrt(x*x + y*y);
}

/* HELPERS */
function RoundToDigits(number, digit){
    var exponent = Math.pow(10, digit)
    
    return Math.round(number * exponent)/exponent;
}

function RandomMinMax(min, max){
    
    return Math.random() * (max - min) + min;
}

function NormalizeVector(x, y){
    var lenght = Math.sqrt(x*x + y*y);
    
    var normX = x/lenght;
    var normY = y/lenght;
    
    return {x : normX, y : normY};
}