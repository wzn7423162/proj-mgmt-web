import React from 'react';
import Style from './DynamicDiscountDetail.module.scss';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

export const DynamicDiscountDetail = React.memo(() => {
  return (
    <div className={cx('dynamic-discount-detail')}>
      <div className={cx('description')}>
        动态优惠受资源使用闲时时段、预计排队时长、预计运行所需总卡时以及当前 GPU
        资源空闲情况等多种因素影响，可能存在波动
      </div>
      <div className={cx('explain-container')}>
        <div className={cx('explain-item')}>
          <div className={cx('titile')}>因素一： 闲时时段</div>
          <ul>
            <li>00:00-4:00: 5.8-7.5折</li>
            <li>04:00-8:00: 5.0-6.6折</li>
            <li>8:00-12:00: 7.5-9.1折</li>
            <li>12:00-16:00: 8.3-10折</li>
            <li>16:00-20:00: 8.3-10折</li>
            <li>20:00-24:00: 7.5-9.1折</li>
          </ul>
        </div>
        <div className={cx('explain-item')}>
          <div className={cx('titile')}>因素二： 预计排队时长，优惠折扣越大</div>
        </div>
        <div className={cx('explain-item')}>
          <div className={cx('titile')}>因素三： 预计运行所需总卡时越多，优惠折扣越大</div>
        </div>
        <div className={cx('explain-item')}>
          <div className={cx('titile')}>因素四： GPU 资源空闲较多时优惠折扣大</div>
        </div>
      </div>
      <div className={cx('footer-description')}>
        动态优惠具体折扣数值受以上多种因素共同影响，各因素对优惠折扣影响非线性权重，最终解释权归平台所有
      </div>
    </div>
  );
});
