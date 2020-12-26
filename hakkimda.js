$('input[name="Duzenle"]').click(function(){
    $(this)
    .val(function(i,v){
        return v === 'Duzenle' ? 'Bitir' : 'Duzenle';
    })
    .prev('textarea[required]')
    .prop('readonly',function(i,r){
        return !r;
    });
});