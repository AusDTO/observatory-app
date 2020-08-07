/*! @gov.au/footer v3.0.5 */
/***************************************************************************************************************************************************************
 *
 * footer function
 *
 * Footers help users who reach the bottom of a page without finding what they want.
 *
 **************************************************************************************************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';


// The following line will be replaced automatically with generic imports for the ES5 pipeline.
// You can safely ignore this bit if you use this module with pancake
//
// [replace-imports]



/**
 * A section for the footer that contains navigational elements
 *
 * @param  {node}   children         - The inside of this section
 * @param  {string} className        - An additional class, optional
 * @param  {string} ariaLabel        - The aria-label attribute, optional
 * @param  {object} attributeOptions - Any other attribute options
 */
export const AUfooterNav = ({ children, className = '', ariaLabel, ...attributeOptions }) => (
	<nav className={`au-footer__navigation ${ className }`} aria-label={ ariaLabel } { ...attributeOptions }>
		{ children }
	</nav>
);

AUfooterNav.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	ariaLabel: PropTypes.string,
};

AUfooterNav.defaultProps = {
	ariaLabel: 'footer',
}


/**
 * A section for the footer that sits at the end
 *
 * @param  {node}   children         - The inside of this section
 * @param  {string} className        - An additional class, optional
 * @param  {object} attributeOptions - Any other attribute options
 */
export const AUfooterEnd = ({ children, className = '', ...attributeOptions }) => (
	<div className={`au-footer__end ${ className }`} { ...attributeOptions }>
		{ children }
	</div>
);

AUfooterEnd.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};


/**
 * DEFAULT
 * The footer component
 *
 * @param  {boolean} dark             - Add the dark variation class, optional
 * @param  {boolean} alt              - Add the alt variation class, optional
 * @param  {node}    children         - The inside of this section
 * @param  {string}  className        - An additional class, optional
 * @param  {object}  attributeOptions - Any other attribute options
 */
const AUfooter = ({ dark, alt, children, className = '', ...attributeOptions }) => (
	<footer
		className={ `au-footer ${ className }${ dark ? ' au-footer--dark' : '' }${ alt ? ' au-footer--alt' : '' } `}
		{ ...attributeOptions }
		role="contentinfo"
	>
		{ children }
	</footer>
);

AUfooter.propTypes = {
	dark: PropTypes.bool,
	alt: PropTypes.bool,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default AUfooter;
