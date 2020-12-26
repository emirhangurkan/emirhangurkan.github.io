function pdf(){
    var divContents = document.getElementById("yazdir").innerHTML;
    var printWindow = window.open('', '', 'height=500,width=1200');
    printWindow.document.write(divContents);
    printWindow.document.close();
    printWindow.print();
    }