import Controller from "sap/fe/core/PageController";
import FilterBar, { FilterBar$FilterChangedEvent } from "sap/fe/macros/filterBar/FilterBar";
import Button from "sap/m/Button";
import MessageBox from "sap/m/MessageBox";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import Filter from "sap/ui/model/Filter";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";

interface FilterObject {
    filters : Filter[]
}

interface Location {
    location : string
}

interface Error {
	message: string
	error: { 
		code: string
		details: Error[] 
	}
}

interface Result {
    amount: string
}

const namespace = "com.sap.gateway.srvd.zui_yasu_stock_o4.v0001."

/**
 * @namespace miyasuta.selectallaction.ext.main
 */
export default class Main extends Controller {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf miyasuta.selectallaction.ext.main.Main
     */
    public onInit(): void {
        super.onInit(); // needs to be called to properly initialize the page controller
    }

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf miyasuta.selectallaction.ext.main.Main
     */
    public  onBeforeRendering(): void {        
        //disable the adapt filter button
        const adaptFilter = this.getView()?.byId("miyasuta.selectallaction::StockMain--FilterBar-content-btnAdapt") as Button;
		adaptFilter.setVisible(false);
    }

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf miyasuta.selectallaction.ext.main.Main
     */
    public  onAfterRendering(): void {
        const view = this.getView();
        const fbConditions = new JSONModel({
            filtersTextInfo: (view?.byId("FilterBar") as FilterBar).getActiveFiltersText()
        })
        view?.setModel(fbConditions, "fbConditions");    
     }

    public onGetTotalStockValue(): void {
        //get filter conditions
        const filterBar = this.getView()?.byId("FilterBar") as FilterBar;
        const filters = (filterBar.getFilters() as FilterObject).filters[0];
        let allFilters: Filter[] = [];

        //when multiple filters are set
        if (Array.isArray(filters?.getFilters())) {
            allFilters = filters.getFilters() as Filter[];
        }
        //when single filter is set
        else if (filters) {
            allFilters.push(filters)
        }

        let plant: string | undefined;
        let locations: Array<Location> = [];
        
        allFilters?.forEach(filter => {
            const processFilter = (f: Filter) => {
                if (f.getPath() === "Plant") {
                    plant = f.getValue1();
                } else if (f.getPath() === "Location") {
                    locations.push({ location: f.getValue1()} )
                }
            }

            if (filter.getPath()) {
                processFilter(filter);
            } else {
                filter.getFilters()?.forEach(innerFilter => processFilter(innerFilter));
            }              
        })

        // validate required parameters
        if (!plant) {
            MessageBox.error("Select a plant in the filter");
            return;
        }        

        //invoce action
        const model = this.getModel();
        const operation = model?.bindContext("/Stock/" + namespace + "calcStockAmountAll(...)") as ODataContextBinding;
        operation.setParameter("plant", plant);
        operation.setParameter("_location", locations);

        const fnSuccess = () => {
            //show total
            const result = operation.getBoundContext().getObject() as Result;
            const amount = result.amount;
            const numberFormat = NumberFormat.getIntegerInstance({
                groupingEnabled: true
            });
            var formattedAmount = numberFormat.format(amount);
            MessageBox.show(`${formattedAmount} JPY`, {
                title: "Stock Amount"
            });
        }
    
        const fnError = (error:Error) => {
            MessageBox.error(error.message);
        }
    
        operation.invoke().then(fnSuccess, fnError);
        
    }
}