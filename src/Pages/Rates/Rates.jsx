import { useState } from 'react';
import DropDown from '../../Components/DropDown';
import TextInput from '../../Components/TextInput';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';

let countries = CountryData.CountryCodes;

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('US');

    const [exchangeRate, setExchangeRate] = useState(0.7456);
    const [progression, setProgression] = useState(0);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');

    const Flag = ({ code }) => (
        <img alt={code || ''} src={`/img/flags/${code || ''}.svg`} width="20px" className={classes.flag} />
    );

    const fetchData = async () => {
        if (!loading) {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            setLoading(false);
        }
    };

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                fetchData();
                return 0;
            }
            return (prevState + deltaTime * 0.0001) % 1;
        });
    });

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            setAmount(value);
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.heading}>Currency Conversion</div>

                <TextInput
                    label="Amount"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    className={classes.amountInput}
                />

                <div className={classes.rowWrapper}>
                    <div>
                        <DropDown
                            leftIcon={<Flag code={fromCurrency} />}
                            label={'From'}
                            selected={countryToCurrency[fromCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key) => {
                                setFromCurrency(key);
                            }}
                            style={{ marginRight: '20px' }}
                        />
                    </div>

                    <div className={classes.exchangeWrapper}>
                        <div className={classes.transferIcon}>
                            <Transfer height={'25px'} />
                        </div>

                        <div className={classes.rate}>{exchangeRate}</div>
                    </div>

                    <div>
                        <DropDown
                            leftIcon={<Flag code={toCurrency} />}
                            label={'To'}
                            selected={countryToCurrency[toCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key) => {
                                setToCurrency(key);
                            }}
                            style={{ marginLeft: '20px' }}
                        />
                    </div>
                </div>

                <ProgressBar
                    progress={progression}
                    animationClass={loading ? classes.slow : ''}
                    style={{ marginTop: '20px' }}
                />

                {loading && (
                    <div className={classes.loaderWrapper}>
                        <Loader width={'25px'} height={'25px'} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rates;
