import Controller from "sap/fe/core/PageController";
import FilterBar, { FilterBar$FilterChangedEvent } from "sap/fe/macros/filterBar/FilterBar";
import Button from "sap/m/Button";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace miyasuta.selectallaction.ext.main
 */
export default class Main extends Controller {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf miyasuta.selectallaction.ext.main.Main
     */
    // public onInit(): void {
    //     super.onInit(); // needs to be called to properly initialize the page controller
    //}

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf miyasuta.selectallaction.ext.main.Main
     */
    public  onBeforeRendering(): void {
        
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
            allFilters: "",
            expand: false,
            filtersTextInfo: (view?.byId("FilterBar") as FilterBar).getActiveFiltersText()
        })
        view?.setModel(fbConditions, "fbConditions");    
     }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf miyasuta.selectallaction.ext.main.Main
     */
    // public onExit(): void {
    //
    //  }

    public onFiltersChanged(event: FilterBar$FilterChangedEvent): void {
        const filterBar = this.getView()?.byId("FilterBar") as FilterBar;
        const allFilters = filterBar.getFilters();

        const fbConditions = event.getSource().getModel("fbConditions") as JSONModel;
        fbConditions.setProperty("/allFilters", JSON.stringify(allFilters, null, " "));

        if (Object.keys(allFilters).length > 0) {
            fbConditions.setProperty("/expanded", true);
        }
        fbConditions.setProperty("/filtersTextInfo", event.getSource().getActiveFiltersText());
    }

    public onGetTotalStockValue(): void {
        const filterBar = this.getView()?.byId("FilterBar") as FilterBar;
        const allFilters = filterBar.getFilters();
        
    }
}