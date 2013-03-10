define([
    '../bootstrap/bootstrap',
    '../jquery/ui/jquery-ui.custom',
    '../jquery/ui/jquery.ui.widget',
    '../jquery/ui/jquery.ui.mouse',
    '../jquery/ui/jquery.ui.sortable'
  ], function(){
    $(function(){
        $('#commands a.goto-command').click(function(e){
            e.preventDefault();
            $("#commands").hide();
            $("#command-view").show();
        });
        $('#groups a.goto-list').click(function(e){
            e.preventDefault();
            $("#commands").show();
            $("#command-view").hide();
        });

        $('a[rel=tooltip]').tooltip();
    });


});