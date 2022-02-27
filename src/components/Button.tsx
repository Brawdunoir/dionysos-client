import React from 'react';
import * as R from 'ramda';
import { Link, To } from 'react-router-dom';

type buttonProps = {
  to?: To,
  text: string,
  colorless?: boolean,
  hidden?: boolean,
  onClick?: any,
  disabled?: boolean,
}

const Button = ({
  to = '', text, colorless = false, hidden = false, onClick, disabled = false,
}: buttonProps) => {
  const style = 'px-8 py-2 rounded-md ease-out transition-all font-medium';
  const visibility = hidden ? 'hidden' : 'visible';
  const cursor = disabled ? 'cursor-not-allowed' : 'cursor-pointer';
  const buttonStyle = colorless ? 'bg-neutral-700' : 'bg-vin-600 hover:bg-vin-500 transition-colors';

  const buttonProp = (
    <button
      type="button"
      className={`${style} ${buttonStyle} ${visibility} ${cursor}`}
      onClick={onClick}
    >
      {text}
    </button>
  );

  const linkProp = (
    <Link
      to={to}
      className={`${style} ${buttonStyle} ${visibility}`}
      onClick={onClick}
    >
      {text}
    </Link>
  );

  return R.isNil(to) || disabled ? buttonProp : linkProp;
};

export default Button;
