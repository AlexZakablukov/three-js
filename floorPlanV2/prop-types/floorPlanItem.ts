import PropTypes from 'prop-types';
import { coordsPropType, paramsPropType } from './helpers';

export const floorPlanItemDataPropType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
});

export const floorPlanItemPropType = PropTypes.shape({
    coords: PropTypes.oneOfType([PropTypes.arrayOf(coordsPropType), PropTypes.oneOf([null])])
        .isRequired,
    params: PropTypes.oneOfType([paramsPropType, PropTypes.oneOf([null])]).isRequired,
    data: floorPlanItemDataPropType.isRequired,
});
