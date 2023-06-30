import PropTypes from 'prop-types';

export const coordsPropType = PropTypes.arrayOf(PropTypes.number.isRequired);

export const drawingToolsPropType = PropTypes.oneOf(['polygon', 'rectangle']);

export const colorPropType = PropTypes.shape({
    r: PropTypes.number.isRequired,
    g: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired,
    a: PropTypes.number.isRequired,
});

export const paramsPropType = PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    drawingTool: drawingToolsPropType,
    hideStand: PropTypes.bool,
    bgColor: PropTypes.oneOfType([colorPropType, PropTypes.oneOf([null])]),
    strokeColor: PropTypes.oneOfType([colorPropType, PropTypes.oneOf([null])]),
    strokeWidth: PropTypes.number,
});
