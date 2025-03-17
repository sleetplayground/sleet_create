import { HeaderContent } from './header-content';
import { KeyPairs } from './key-pairs';
import { ImplicitAccounts } from './implicit-accounts';
import { NamedAccounts } from './named-accounts';
import { SubAccounts } from './sub-accounts';

export const MainContent = () => {
  return (
    <>
      <HeaderContent />
      <KeyPairs />
      <ImplicitAccounts />
      <NamedAccounts />
      <SubAccounts />
    </>
  );
};