import { connect } from 'react-redux';
import { selectDaemonSettings } from 'redux/selectors/settings';
import WalletBackup from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
});

export default connect(select)(WalletBackup);
