using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BrWebHost.Models.Entities
{
    [NotMapped]
    public class XhrResult: JsonResult
    {
        public class Items
        {
            public object Values { get; set; } = null;
            public bool Succeeded { get; set; } = true;
            public Error[] Errors { get; set; } = new Error[] { };
        }

        public static XhrResult CreateSucceeded()
        {
            var items = new Items();
            items.Succeeded = true;
            return new XhrResult(items);
        }

        public static XhrResult CreateSucceeded(object value)
        {
            var items = new Items();
            items.Succeeded = true;
            items.Values = value;
            return new XhrResult(items);
        }


        public static XhrResult CreateError(string message, string name = null)
        {
            var items = new Items();
            items.Succeeded = false;
            items.Errors = new Error[]
            {
                new Error() { Message = message, Name = name }
            };
            return new XhrResult(items);
        }

        public static XhrResult CreateError(IEnumerable<Error> errors)
        {
            var items = new Items();
            items.Succeeded = false;
            items.Errors = errors.ToArray();
            return new XhrResult(items);
        }

        public static XhrResult CreateError(ModelStateDictionary modelState)
        {
            var errors = new List<Error>();
            foreach (var pair in modelState)
                errors.AddRange(GetModelStateErrors(pair.Key, pair.Value));

            var items = new Items();
            items.Succeeded = false;
            items.Errors = errors.ToArray();
            return new XhrResult(items);
        }

        private static Error[] GetModelStateErrors(string name, ModelStateEntry msEnt)
        {
            var list = new List<Error>();

            foreach (var err in msEnt.Errors)
            {
                list.Add(new Error()
                {
                    Name = name,
                    Message = $"Message: {err.ErrorMessage}, Exception: {err.Exception?.Message}, StuckTrace: {err.Exception?.StackTrace}"
                });
            }

            if (msEnt.Children != null)
            {
                foreach (var child in msEnt.Children)
                    list.AddRange(GetModelStateErrors(name, child));
            }

            return list.ToArray();
        }

        public static XhrResult CreateError(Exception exception)
        {
            var errors = new List<Error>();
            errors.AddRange(GetExceptionErrors(exception));

            var items = new Items();
            items.Succeeded = false;
            items.Errors = errors.ToArray();
            return new XhrResult(items);
        }

        private static Error[] GetExceptionErrors(Exception exception)
        {
            var list = new List<Error>();

            list.Add(new Error()
            {
                Name = "",
                Message = $"Exception: {exception.Message}, StuckTrace: {exception.StackTrace}"
            });

            if (exception.InnerException != null)
                list.AddRange(GetExceptionErrors(exception.InnerException));

            return list.ToArray();
        }


        /// <summary>
        /// 引数付きコンストラクタ
        /// </summary>
        /// <param name="items"></param>
        public XhrResult(Items items) : base(items)
        {
        }
    }
}
