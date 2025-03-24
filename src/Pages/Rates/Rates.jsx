import { useState, useMemo } from 'react';
import DropDown from '../../Components/DropDown';
import TextInput from '../../Components/TextInput';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryCurrency from '../../Libs/CountryCurrency.json';

const countries = CountryData.CountryCodes;
const MARKUP_PERCENTAGE = 0.005; // 0.5% markup

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
            try {
                const sellCurrencyCode = countryCurrency[fromCurrency];
                const buyCurrencyCode = countryCurrency[toCurrency];

                const url = `https://rates.staging.api.paytron.com/rate/public?buyCurrency=${buyCurrencyCode}&sellCurrency=${sellCurrencyCode}`;

                const options = {
                    method: 'GET',
                    headers: { 
                        accept: 'application/json',
                        'content-type': 'application/json'
                    }
                };

                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setExchangeRate(data.retailRate);
            } catch (error) {
                console.error('Failed to fetch live rate:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                fetchData();
                return 0;
            }
            return (prevState + deltaTime * 0.0001) % 1;
        });
    });

    const trueAmount = useMemo(() => amount * exchangeRate, [amount, exchangeRate]);
    const markedUpRate = useMemo(() => exchangeRate + MARKUP_PERCENTAGE * exchangeRate, [exchangeRate]);
    const markedUpAmount = useMemo(() => amount * markedUpRate, [amount, markedUpRate]);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            setAmount(value);
        }
    };

    const formatAmountCurrency = (number) =>
        new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);

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
                            selected={countryCurrency[fromCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryCurrency[code],
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
                            selected={countryCurrency[toCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryCurrency[code],
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

                {parseFloat(amount) > 0 && (
                    <div className={classes.result}>
                        <p className={classes.label}>True Amount:</p>
                        <p className={classes.trueAmount}>
                            {formatAmountCurrency(trueAmount)}
                        </p>
                        <p className={classes.label}>Marked-Up Amount:</p>
                        <p className={classes.markedUpAmount}>
                            {formatAmountCurrency(markedUpAmount)}
                        </p>
                    </div>
                )}

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
