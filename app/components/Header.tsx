import HeaderContent from './HeaderContent';
import HeaderLayout from './HeaderLayout';

// FIXME: this needs refactoring, 3 components just for the header is absurd
export const Header = () => {
  return (
    <HeaderLayout>
      <HeaderContent />
    </HeaderLayout>
  );
};

export default Header;
