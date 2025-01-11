sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'miyasuta/selectallaction/test/integration/FirstJourney',
		'miyasuta/selectallaction/test/integration/pages/StockMain'
    ],
    function(JourneyRunner, opaJourney, StockMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('miyasuta/selectallaction') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStockMain: StockMain
                }
            },
            opaJourney.run
        );
    }
);