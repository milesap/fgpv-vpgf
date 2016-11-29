(() => {
    'use strict';

    /**
     * @module exportSizesService
     * @memberof app.ui
     * @requires dependencies
     * @description
     *
     * The `exportSizesService` handles the ExportSize objects which populated the size selector in the map export dialog.
     * There are three tipes size options: custom, default, and regular.
     * - regular size options are static and hardcoded;
     * - default size option depends on the actual size of the viewer container and is generally the same size as the map object; this option should be updated every time the browser was resized.
     * - custom size option is used for user-defined sizes; this option should not be modified directly (bound to input fields), instead, the temporary size option should be modified by the user; this service provides several helper function to update he custom size option with the one from the temporary one, check if the custom size is equal to the temporary one, and to reset the temporary size to the last custom size used.
     */
    angular
        .module('app.ui')
        .factory('exportSizesService', exportSizesService);

    function exportSizesService(ExportSize, storageService) {
        const customOption = new ExportSize('export.size.custom', 1); // user types in the exact size
        const defaultOption = new ExportSize('export.size.default', 1); // default option is always the same size as the map/shell
        const tempOption = new ExportSize('export.size.custom', 1); // temp option is used as an intermediary step when setting a custom size

        const options = [
            defaultOption,
            new ExportSize('export.size.small', 1, 720),
            new ExportSize('export.size.medium', 1, 1080),
            customOption
        ];

        const selectedOption = defaultOption;

        const service = {
            options,
            customOption,
            selectedOption,
            tempOption,
            exportSizeRatio: 1,

            height: {
                min: 320,
                max: 2160
            },
            width: {
                min: 1,
                max: 1
            },

            update,

            updateCustomOption,
            resetTemporaryOption,

            isCustomOptionUpdated,
            isCustomOptionSelected
        };

        return service;

        /**
         * Update all the sizes based on the current map size derived from the shell node.
         *
         * @function update
         * @private
         * @return {Object} itself
         */
        function update() {
            const shellNode = storageService.panels.shell;
            const [mapWidth, mapHeight] = [shellNode.width(), shellNode.height()];

            service.exportSizeRatio = mapWidth / mapHeight;
            service.options.forEach(option =>
                (option.widthHeightRatio = service.exportSizeRatio));

            // temp option is not in the exposed options list, so need to update it manually
            service.tempOption.widthHeightRatio = service.exportSizeRatio;

            defaultOption.height = mapHeight;

            service.width = {
                min: Math.round(service.height.min * service.exportSizeRatio),
                max: Math.round(service.height.max * service.exportSizeRatio)
            };

            return service;
        }

        /**
         * Updates the custom option with dimensions from the temporary one.
         * @function updateCustomOption
         */
        function updateCustomOption() {
            service.customOption.height = service.tempOption.height;
        }

        /**
         * Resets the temporary size option with the last used custom option.
         * @function resetTemporaryOption
         */
        function resetTemporaryOption() {
            service.tempOption.height = service.customOption.height;
        }

        /**
         * Checks if the custom size option was updated with the dimensions from the temporary one.
         * @function isCustomOptionUpdated
         * @return {Boolean} true if the custom and temporary size options have the same dimensions
         */
        function isCustomOptionUpdated() {
            return service.customOption.height === service.tempOption.height &&
                service.customOption.height !== null;
        }

        /**
         * Checks if the custom option is currently selected.
         * @function isCustomOptionSelected
         * @returns {Boolean} true if the custom size option is currently selected
         */
        function isCustomOptionSelected() {
            return service.customOption === service.selectedOption;
        }
    }
})();
